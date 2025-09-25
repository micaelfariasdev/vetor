#!/bin/bash

echo "Iniciando a atualização do site..."
echo "---"

echo "Iniciando o build..."

Executa o comando de build do npm.
npm run build


echo "---"
# Envia a pasta 'dist' para o servidor remoto.
scp -r -i ~/chave.key \
    dist \
    ubuntu@164.152.62.129:~/vetor/

echo "---"
echo "Processo finalizado."