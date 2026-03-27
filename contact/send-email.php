<?php

declare(strict_types=1);

// Carrega as configurações do arquivo config.php
$config = require __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit('Método não permitido.');
}

function clean_input(?string $value): string
{
    return trim((string) $value);
}

$nome = clean_input($_POST['nome'] ?? '');
$email = clean_input($_POST['email'] ?? '');
$telefone = clean_input($_POST['telefone'] ?? '');
$assunto = clean_input($_POST['assunto'] ?? '');
$mensagem = clean_input($_POST['mensagem'] ?? '');
$formOrigin = clean_input($_POST['form_origin'] ?? 'Site');

// Validação de campos obrigatórios
if ($nome === '' || $email === '' || $assunto === '' || $mensagem === '') {
    header('Content-Type: application/json; charset=UTF-8');
    echo json_encode([
        'success' => false,
        'message' => 'Preencha todos os campos obrigatórios.'
    ]);
    exit;
}

// Validação de e-mail do cliente
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    header('Content-Type: application/json; charset=UTF-8');
    echo json_encode([
        'success' => false,
        'message' => 'Email inválido.'
    ]);
    exit;
}

/*

| Escolher email destino conforme a origem do formulário
| Ajustado para os e-mails que você criou na Hostinger
*/
$originsEscola = ['Clínica-Escola', 'Escola', 'Colegio'];

if (in_array($formOrigin, $originsEscola, true)) {
    $to = 'colegio@psicosapi.com';
} else {
    $to = 'atendimento@psicosapi.com';
}

$siteName = $config['site_name'] ?? 'PsicoSAPi';
$emailSubject = "[{$siteName}] Novo contacto - {$assunto}";

$emailBody = <<<TEXT
Novo pedido de contacto recebido

Origem do formulário: {$formOrigin}
Destino: {$to}
Nome: {$nome}
Email: {$email}
Telefone: {$telefone}
Assunto: {$assunto}

Mensagem:
{$mensagem}
TEXT;

/*

| Configuração de Headers para Hostinger
| O 'From' DEVE ser um e-mail real do seu domínio para evitar SPAM ou bloqueio.
*/
$headers = [];
$headers[] = "From: {$siteName} <atendimento@psicosapi.com>"; 
$headers[] = "Reply-To: {$nome} <{$email}>"; // Quando você responder, vai para o cliente
$headers[] = "Content-Type: text/plain; charset=UTF-8";
$headers[] = "X-Mailer: PHP/" . phpversion();

/*

| Debug log (Opcional - útil para ver se o PHP está processando)
*/
file_put_contents(__DIR__ . '/debug-log.txt', "Envio para: {$to}\n" . $emailBody . "\n\n---\n\n", FILE_APPEND);

/*
| Envio do email usando a função nativa do PHP
*/
$mailSent = mail(
    $to,
    $emailSubject,
    $emailBody,
    implode("\r\n", $headers)
);

header('Content-Type: application/json; charset=UTF-8');

if ($mailSent) {
    echo json_encode([
        'success' => true,
        'message' => 'Mensagem enviada com sucesso.'
    ]);
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Erro técnico: O servidor recusou o envio do e-mail.'
    ]);
}
exit;
