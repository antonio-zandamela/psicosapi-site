<?php

declare(strict_types=1);

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

if ($nome === '' || $email === '' || $assunto === '' || $mensagem === '') {
    header('Content-Type: application/json; charset=UTF-8');
    echo json_encode([
        'success' => false,
        'message' => 'Preencha todos os campos obrigatórios.'
    ]);
    exit;
}

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
*/
$originsEscola = ['Clínica-Escola'];

if (in_array($formOrigin, $originsEscola, true)) {
    $to = $config['emails']['escola'];
} else {
    $to = $config['emails']['clinica'];
}

$siteName = $config['site_name'];

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

$headers = [];
$headers[] = "From: {$siteName} <no-reply@" . ($_SERVER['SERVER_NAME'] ?? 'localhost') . ">";
$headers[] = "Reply-To: {$nome} <{$email}>";
$headers[] = "Content-Type: text/plain; charset=UTF-8";

/*
| Debug log para confirmar que o backend recebeu o pedido
*/
file_put_contents(__DIR__ . '/debug-log.txt', $emailBody . "\n\n---\n\n", FILE_APPEND);

/*
| Envio do email
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
        'message' => 'Ocorreu um erro ao enviar a mensagem.'
    ]);
}
exit;
