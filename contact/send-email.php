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
    exit('Preencha todos os campos obrigatórios.');
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    exit('Email inválido.');
}

$to = $config['to_email'];
$siteName = $config['site_name'];

$emailSubject = "[{$siteName}] Novo contacto - {$assunto}";

$emailBody = <<<TEXT
Novo pedido de contacto recebido

Origem do formulário: {$formOrigin}

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

file_put_contents(__DIR__ . '/debug-log.txt', $emailBody . "\n\n---\n\n", FILE_APPEND);

$mailSent = mail(
    $to,
    $emailSubject,
    $emailBody,
    implode("\r\n", $headers)
);

if ($mailSent) {
    echo "Mensagem enviada com sucesso.";
} else {
    echo "Erro ao enviar mensagem.";
}