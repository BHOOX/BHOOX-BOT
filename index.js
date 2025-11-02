//=========CRÉDITOS=============\\
/*
bot criado por (DEV-VICTOR )
sla né, poderia pelo menos deixar os créditos
afinal, o bot foi feito por mim 
mas vc que sabe.
sei que não é muita coisa, a visto de quem já sabe progamar
mas eu fiz pensando na qualidade
não na quantidade
caso queira suporte entre no nosso grupo
link: https://chat.whatsapp.com/EJ7boLA4ri7L3FMsWcuNP5?mode=wwt

CREDITOS:
DEV-VICTOR
*/

//===========BAILEYS==========\\
const { 
default: makeWASocket, downloadContentFromMessage,emitGroupParticipantsUpdate,emitGroupUpdate,makeInMemoryStore,prepareWAMessageMedia, MediaType,WAMessageStatus, AuthenticationState, GroupMetadata, initInMemoryKeyStore, MiscMessageGenerationOptions,useMultiFileAuthState, BufferJSON,WAMessageProto,MessageOptions, PHONENUMBER_MCC, WAFlag,WANode,	 WAMetric, ChatModification,MessageTypeProto,WALocationMessage, ReconnectMode,WAContextInfo,proto,	 WAGroupMetadata,ProxyAgent, waChatKey,MimetypeMap,MediaPathMap,WAContactMessage,WAContactsArrayMessage,WAGroupInviteMessage,WATextMessage,WAMessageContent,WAMessage,BaileysError,WA_MESSAGE_STATUS_TYPE,MediaConnInfo, generateWAMessageContent, URL_REGEX,Contact, WAUrlInfo,WA_DEFAULT_EPHEMERAL,WAMediaUpload,mentionedJid,processTime, Browser, makeCacheableSignalKeyStore ,MessageType,Presence,WA_MESSAGE_STUB_TYPES,Mimetype,relayWAMessage, Browsers,GroupSettingChange,delay,DisconnectReason,WASocket,getStream,WAProto,isBaileys,AnyMessageContent,generateWAMessageFromContent, fetchLatestBaileysVersion,processMessage,processingMutex
} = require('baileys-mod');
//Para ativar os botões, basta substituir o nome "Baileys" por "Baileys-mod". Assim, qualquer comando que utilize botões funcionará normalmente, já que a base está totalmente adaptada para eles.
//=========MODULOS===========\\
let pino = require('pino')
const fs = require('fs')
const axios = require('axios');
const chalk = require('chalk')
const Pino = require('pino')
const NodeCache = require("node-cache")
const readline = require("readline")
const PhoneNumber = require('awesome-phonenumber')


let phoneNumber = "5546999250673"
const pairingCode = !!phoneNumber || process.argv.includes("--pairing-code")
const useMobile = process.argv.includes("--mobile")
const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
const question = (text) => new Promise((resolve) => rl.question(text, resolve))
//============CONFIG==========\\
const { prefix, botName, BaseApiDark, DARK_USERNAME, DARK_APIKEY, verMsg } = require("./storage/config.json");//Configurações do bot como prefixo, nome do bot etc...
const fotomenu = "./assets/imagem/menu.png" //Foto do menu.

//=======INICIO DO BOTECO=======\\
async function ligarbot() {
const { state, saveCreds } = await useMultiFileAuthState('./storage/BHOOX-qr')
const { version, isLatest } = await fetchLatestBaileysVersion()
const msgRetryCounterCache = new NodeCache()
const client = makeWASocket({
version : [2, 3000, 1029037448],
auth: {
creds: state.creds,
keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'silent' })),
},
logger: pino({ level: 'silent' }),
printQRInTerminal: !process.argv.includes("--code"),
mobile: false,
browser: ['Ubuntu','Edge','125.0.0.0'],
emitOwnEvents: true,
generateHighQualityLinkPreview: true,
msgRetryCounterCache,
connectTimeoutMs: 60000,
defaultQueryTimeoutMs: 0,
keepAliveIntervalMs: 20000,
patchMessageBeforeSending: (message) => {
const requiresPatch = !!(message.buttonsMessage || message.templateMessage || message.listMessage);
if (requiresPatch) {
message = {
viewOnceMessage: {
message: {
messageContextInfo: {
deviceListMetadataVersion: 2,
deviceListMetadata: {},
},
...message,
},
},
};
}
return message;
},
});

//======CONEXÃO POR CODE=========\\
if (!client.authState.creds.registered) {
console.clear();
console.log(chalk.bgHex('#1a1a1a').hex('#00A0FF')('\n┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓'));
console.log(chalk.bgHex('#1a1a1a').hex('#00A0FF')('┃          Conexão por Código          '));
console.log(chalk.bgHex('#1a1a1a').hex('#00A0FF')('┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛\n'));
console.log(chalk.hex('#00A0FF')('Informe o número do bot (exemplo: +5546999250673):\n'));
const phoneNumber = await question(chalk.hex('#00A0FF')('Número: \n'));
if (!phoneNumber) {
console.log('\n' + chalk.bgHex('#FF1F00')(chalk.white('Erro: Inclua o código do país, ex: +55...')));
process.exit(1);
}
const NumeroLimpo = phoneNumber.replace(/[^0-9]/g, '');
let code = await client.requestPairingCode(NumeroLimpo);
console.log(chalk.bgHex('#1a1a1a').hex('#00A0FF')('\n┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓'));
console.log(chalk.bgHex('#1a1a1a').hex('#00A0FF')('┃    Código de Emparelhamento       '));
console.log(chalk.bgHex('#1a1a1a').hex('#00A0FF')('┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛\n'));
code = code?.match(/.{1,4}/g)?.join("-") || code;
console.log(chalk.bold.hex('#00A0FF')('Código: ') + chalk.bold.hex('#00A0FF')(code));
console.log(chalk.hex('#aaaaaa')('\nAguardando conexão com o WhatsApp...\n'));
}

//=======CLIENTES=======\\
var astaroth = client;
var laura = client;
var suc = client;
//*==================*\\
client.ev.on('chats.set', () => { console.log('setando conversas...'); })
client.ev.on('contacts.set', () => { console.log('setando contatos...'); })
client.ev.on('creds.update', saveCreds)

//========ATT DE MENSAGENS=========\\
client.ev.on('messages.upsert', async ({ messages }) => {
try {
const info = messages[0]
if (!info.message) return 

// ====== PERMITIR COMANDOS DO PRÓPRIO BOT ====== //
if (info.key.fromMe) {
info.key.remoteJid = info.key.remoteJid || client.user.id
info.key.participant = client.user.id
console.log('📩 Mensagem enviada pelo próprio bot detectada')
}

const key = {
remoteJid: info.key.remoteJid,
id: info.key.id, 
participant: info.key.participant 
}
//PARA VIZUALIZAR AS MENSAGENS ENVIADAS AO BOT
if(verMsg) {
await client.readMessages([info.key]);
} else {
if(info.key.remoteJid == "status@broadcast") return;
}
const altpdf = Object.keys(info.message)
const type = altpdf[0] == 'senderKeyDistributionMessage' ? altpdf[1] == 'messageContextInfo' ? altpdf[2] : altpdf[1] : altpdf[0]

const from = info.key.remoteJid

const bodyofc = type === "conversation" ? info.message.conversation : type === "viewOnceMessageV2" ? info.message.viewOnceMessageV2.message.imageMessage ? info.message.viewOnceMessageV2.message.imageMessage.caption : info.message.viewOnceMessageV2.message.videoMessage.caption : type === "imageMessage" ? info.message.imageMessage.caption : type === "videoMessage" ? info.message.videoMessage.caption : type === "extendedTextMessage" ? info.message.extendedTextMessage.text : type === "viewOnceMessage" ? info.message.viewOnceMessage.message.videoMessage ? info.message.viewOnceMessage.message.videoMessage.caption : info.message.viewOnceMessage.message.imageMessage.caption : type === "documentWithCaptionMessage" ? info.message.documentWithCaptionMessage.message.documentMessage.caption : type === "buttonsMessage" ? info.message.buttonsMessage.imageMessage.caption : type === "buttonsResponseMessage" ? info.message.buttonsResponseMessage.selectedButtonId : type === "listResponseMessage" ? info.message.listResponseMessage.singleSelectReply.selectedRowId : type === "templateButtonReplyMessage" ? info.message.templateButtonReplyMessage.selectedId : type === "groupInviteMessage" ? info.message.groupInviteMessage.caption : type === "pollCreationMessageV3" ? info.message.pollCreationMessageV3 : type === "interactiveResponseMessage" ? JSON.parse(info.message.interactiveResponseMessage.nativeFlowResponseMessage.paramsJson).id : type === "text" ? info.text : ""

const safeBody = typeof bodyofc === "string" ? bodyofc.trim() : "";
const body = safeBody;

const isGroup = from.endsWith('@g.us');
const isCmd = body.startsWith(prefix)
const comando = isCmd ? body.slice(1).trim().split(/ +/).shift().toLocaleLowerCase() : null
const sendere2 = info.key.participant?.includes('@lid') ? info.key.participant : info.key.participantAlt;
const sendere = info.key.participantAlt?.includes('@s.whatsapp.net') ? info.key.participantAlt : info.key.participant;
const sender2 = sendere2 || from; //Sender puxando o Lid
const sender = sendere || from; //Sender puxando o Jid
const pushname = info.pushName ? info.pushName : ""
const args = safeBody.split(/ +/).slice(1);
const q = args.join(' ')

var texto_exato = (type === 'conversation') ? info.message.conversation : (type === 'extendedTextMessage') ? info.message.extendedTextMessage.text : ''
const texto = texto_exato.slice(0).trim().split(/ +/).shift().toLowerCase()

//SIMULA ESCRITA
async function escrever (texto) {
await client.sendPresenceUpdate('composing', from) 
await esperar(1000) 
client.sendMessage(from, { text: texto }, {quoted: info})
}
//ENVIA UMA MENSAGEM 
const enviar = async (jid, texto, quoted = null) => {
  await client.sendMessage(jid, { text: texto }, { quoted });
};

const enviarImg2 = async (link, texto) => {await client.sendMessage(from, {image: {url: link}, caption: texto})}

//ENVIA VÍDEO 
const enviarVd = async (link) => {await client.sendMessage(from, {video: {url: link }, mimetype: "video/mp4", fileName: "play.mp4"}, {quoted: info})}

const enviarVd2 = async (link, texto) => {await client.sendMessage(from, {video: {url: link }, caption: texto, mimetype: "video/mp4", fileName: "video.mp4"}, {quoted: info})}

//ENVIA UM GIF SIMPLES 
const enviarGif = async (link) => {await client.sendMessage(from, { video: {url: link}, gifPlayback: true}, { quoted: info })}

const enviarGif2 = async (link, texto) => {await client.sendMessage(from, { video: {url: link}, caption: texto, gifPlayback: true}, { quoted: info })}
//ENVIA UM AUDIO
const enviarAd = async (link) => {client.sendPresenceUpdate('recording', from);
await esperar(1000);
await client.sendMessage(from, {audio: {url: link }, mimetype: "audio/mpeg"}, {quoted: info})}

const enviarAd2 = async (link) => {await client.sendMessage(from, {audio: {url: link }, mimetype: "audio/mpeg"}, {quoted: selo})}

//CAUSA UM DELAY ENTRE FUNÇÃO 
const esperar = async (tempo) => {
return new Promise(funcao => setTimeout(funcao, tempo));
}
//REAGE A UMA MENSAGEM
const reagir = (reassao) => {
client.sendMessage(from, {react: {text: reassao, key: info.key}})}
//===========BOTOES==========//
async function botaoNormal(client, id, texto, link, botoes) {
try {
var fotin = await prepareWAMessageMedia({ image: {url: link} }, { upload: client.waUploadToServer })
await await client.relayMessage(
id,{ interactiveMessage: { header: { title: "", subtitle: '', hasMediaAttachment: true, imageMessage: fotin.imageMessage
},body: { text: texto },
footer : { "text": "𝐁𝐚𝐬𝐞: BHOOX-BOT-LITE" },
nativeFlowMessage: {
buttons: botoes.map(botao => ( { name: "quick_reply", buttonParamsJson: JSON.stringify({ display_text: botao.display_text, id: botao.id })} )),
},messageParamsJson: "", },},{});
} catch (e) {
console.log(e);
enviarPonto(`Deu erro ao enviar o botão...`)
}
}

async function botaoLista(client, id, texto, url, titulo, titulo2, rows){
try {
const fotin = await prepareWAMessageMedia( { image: { url: url } }, { upload: client.waUploadToServer } );
const msgLista = { interactiveMessage: { header: { title: "", subtitle: '', hasMediaAttachment: true, imageMessage: fotin.imageMessage }, body: { text: texto }, footer: { text: "𝐁𝐚𝐬𝐞: BHOOX-BOT-LITE" }, nativeFlowMessage: { buttons: [{ name: "single_select", buttonParamsJson: JSON.stringify({ title: titulo, sections: [{ title: titulo2, rows }]})}],messageParamsJson: ""}}};
await client.relayMessage(id, msgLista, {});
} catch (e) {
console.log(e);
enviarPonto(`Deu erro ao enviar o botão...`)
}
}

async function botaoUrl(client, id, foto, titulo, botoes) {
try {
const fotin = await prepareWAMessageMedia({ image: { url: foto } },{ upload: client.waUploadToServer });
await client.relayMessage(id, { interactiveMessage: { header: { hasMediaAttachment: true, imageMessage: fotin.imageMessage }, body: { text: titulo }, footer: { text: "𝐁𝐚𝐬𝐞: BHOOX-BOT-LITE" }, nativeFlowMessage: { buttons: botoes.map(botao => ({ name: "cta_url", buttonParamsJson: JSON.stringify({ display_text: botao.name, url: botao.url, merchant_url: botao.url }) })) }, messageParamsJson: "" } }, {});
} catch (e) {
console.log(e);
enviarPonto(`Deu erro ao enviar o botão...`)
}
}

async function botaoCopia(client, id, foto, titulo, botoes) {
try {
const fotin = await prepareWAMessageMedia({ image: { url: foto } }, { upload: client.waUploadToServer });
await client.relayMessage(id, { interactiveMessage: { header: { hasMediaAttachment: true, imageMessage: fotin.imageMessage }, body: { text: titulo }, footer: { text: "𝐁𝐚𝐬𝐞: BHOOX-BOT-LITE" }, nativeFlowMessage: { buttons: botoes.map(botao => ({ name: "cta_copy", buttonParamsJson: JSON.stringify({ display_text: botao.name, id: botao.id, copy_code: botao.copy }) })) }, messageParamsJson: ""}}, {});
} catch (e) {
console.log(e);
enviarPonto(`Deu erro ao enviar o botão...`)
}
}

async function botaoCopia2(client, id, foto, titulo, botoes) {
try {
const fotin = await prepareWAMessageMedia({ image: foto }, { upload: client.waUploadToServer });
await client.relayMessage(id, { interactiveMessage: { header: { hasMediaAttachment: true, imageMessage: fotin.imageMessage }, body: { text: titulo }, footer: { text: "𝐁𝐚𝐬𝐞: BHOOX-BOT-LITE" }, nativeFlowMessage: { buttons: botoes.map(botao => ({ name: "cta_copy", buttonParamsJson: JSON.stringify({ display_text: botao.name, id: botao.id, copy_code: botao.copy }) })) }, messageParamsJson: ""}}, {});
} catch (e) {
console.log(e);
enviarPonto(`Deu erro ao enviar o botão...`)
}
}

switch(comando) {
//========CASES============\\
//BOTÕES 
case 'testebotao':
//Botão lista -- Envia uma mensagem de botão interativo no formato lista.
botaoLista(client, from, "Bom dia", fotomenu, "titulo", "titulo2", [{ header: "nome", title: "titulo", description: "", id: `${prefix}menu`}])
//Botão normal -- Envia uma mensagem de botão interativo no formato normal kk.
botaoNormal (client, from, "oi", fotomenu, [{ display_text: "Menu", id: `${prefix}menu` }])
//Botão cópia -- Envia uma mensagem de botão interativo no formato copia (o usuário consegue copiar oq ta no botão).
botaoCopia(client, from, fotomenu, "Texto principal aqui",
[{name: "Copiar", id: "texto", copy: "texto" }]);
//Botão link -- Envia uma mensagem de botão interativo no formato link (O usuyvai direto para o link que tiver no botão).
botaoUrl(client, from, fotomenu, "Clique no botão abaixo para acessar o site:", [{name: "Visitar Site", url: "link"},]);
break
case 'botaolista':
var fotin = await prepareWAMessageMedia({ image: {url: fotomenu } }, { upload: laura.waUploadToServer })
await await laura.relayMessage( from,{ interactiveMessage: { header: {
title: "um macaco pula de galho em galho",
subtitle: '', hasMediaAttachment: true, imageMessage: fotin.imageMessage },body: { text: `` }, footer : { "text": "Dev Victor" }, nativeFlowMessage: {
buttons: [
{
name: "single_select",
buttonParamsJson: JSON.stringify({
title: "LISTA",
sections: [{
title: "Menus de comandos: ",
highlight_label: "comandos",
rows: [
{
header: "Menu",
title: "-> Menu",
description: "",
id: prefix + "menu"}
],},
]}) }
]},messageParamsJson: "", },},{})
break
//====[ COMANDOS DE EXEMPLO ]====//
//simula o bot escrevendo
case 'escreva':
escrever('Fala comigo meu cria')
break
//envia uma mensagem 
case 'enviar':
enviar('oq tem de bom?')
break
//menu simples 
case 'menu':
const menuTxt = `
╭━━⪩ BEM VINDO! ⪨━━
▢
▢ • ${botName}
▢ • Data: 01/01/2025
▢ • Hora: 00:00:00
▢ • Prefixo: ${prefix}
▢
╰━━─「🪐」─━━

╭━━⪩ DONO ⪨━━
▢
▢ • ${prefix}off
▢ • ${prefix}on
▢ • ${prefix}clonargroup
▢
╰━━─「🌌」─━━

╭━━⪩ CLITENTE ⪨━━
▢
▢ • ${prefix}clientes
▢
╰━━─「😎」─━━

╭━━⪩ ADMINS ⪨━━
▢
▢ • ${prefix}groupadm
▢
╰━━─「⭐」─━━

╭━━⪩ MENU ⪨━━
▢
▢ • ${prefix}enviar
▢ • ${prefix}escreva
▢ • ${prefix}img
▢ • ${prefix}img2
▢ • ${prefix}video
▢ • ${prefix}video2
▢ • ${prefix}audio
▢ • ${prefix}audio2
▢ • ${prefix}ai
▢ • ${prefix}reagir
▢ • ${prefix}esperar
▢
╰━━─「🚀」─━━
`
enviarImg2(fotomenu, menuTxt)
break
//imagem normal
case 'img':
enviarImg(fotomenu)
break
//imagem com legenda 
case 'img2':
enviarImg2(fotomenu, "LEGENDA")
break
//vídeo normal
case 'video':
enviarVd("LINK OU CAMINHO DO VÍDEO")
break
//vídeo com legenda 
case 'video2':
enviarVd2("LINK OU CAMINHO DO VÍDEO", "LEGENDADA")
break
//audio com gravação 
case 'audio':
enviarAd("https://files.catbox.moe/uvge5f.wav")
break
//audio com ppt: true
case 'audio2':
enviarAd2("https://files.catbox.moe/uvge5f.wav")
break
//mensagem com selo AI
case 'ai':
await client.junim(from, { text: "Isso e uma mensagem com selo AI"}, { ai: true });
break
//reagi a uma mensagem 
case 'reagir':
reagir("👌")//Reage com o Emoji.
enviar("reação enviada")
break
//espera algum tempo pra responder 
case 'esperar':
await esperar(2000)//2 Segundos
enviar("Esperei 2 segundos 😊👌")
break

//====[ COMANDOS BUSINESS ]======\\Talvez algumas não funcionam por conta que não testei e os códigos foram tirados dos códigos principais da própria Baileys (funções experimentais) etc...
//Atualiza informações Business do perfil
case 'attperfil':
await client.updateBussinesProfile({
address: "Rua dos Devs, 123",
email: "contato@meunegocio.com",
description: "Vendemos produtos de programação 💻",
websites: ["https://LINK AQUI"],
hours: {
timezone: "America/Sao_Paulo",
days: [
{ day: "monday", mode: "specific_hours", openTimeInMinutes: 540, closeTimeInMinutes: 1080 }, // 9h às 18h
{ day: "tuesday", mode: "open_24h" },
{ day: "sunday", mode: "closed" }
]
}
});
break
//muda o banner do perfil do usuário
case 'attbanner': {
try { 
await client.updateCoverPhoto("CAMINHO DO BANNER");
enviar("Banner do perfil atualizada");
} catch (b) {
console.log("erro na função comercial:", b);
enviar("[Erro] - Deu erro ao executar uma função comercial...")
}
}
break
//Remove o banner do perfil
case 'dellbanner': {
try { 
await client.removeCoverPhoto("ID DO BANER"); 
enviar("Banner removido com sucesso!");
} catch (b) {
console.log("erro na função comercial:", b);
enviar("[Erro] - Deu erro ao executar uma função comercial...")
}
}
break
//Puxa os catálogos do usuário 
case 'obcatalogo': {
try { 
const catalogo = await client.getCatalog({ jid: sender, limit: 5 /*Limite de pux*/ });
for (const p of catalogo.products) {
const preco = p.price && p.currency ? (p.price / 100).toLocaleString('pt-BR', { style: 'currency', currency: p.currency }) : "Preço não informado";
const texto = `*${p.name}*\n\n${p.description}\n\nPreço: ${preco}\nDisponibilidade: ${p.availability}`;

const imagens = p.imageUrls || [];
if (imagens.length > 0) { await client.sendMessage(from, { image: { url: imagens[0].url }, caption: texto
});
} else {
await client.sendMessage(from, { text: texto });
}
await new Promise(r => setTimeout(r, 1000));//pausa de um segundo a cada envio
}
} catch (b) {
console.log("erro na função comercial:", b);
enviar("[Erro] - Deu erro ao executar uma função comercial...")
}
}
break
//Cria um produto de venda
case 'criarproduto': {
try { 
const produto = await client.productCreate({
name: "NOME DO PRODUTO",
description: "DESCRIÇÃO DO PRODUTO",
retailerId: "ID",
url: "LINK",
price: "5000", // valor em centavos (R$50,00)
currency: "BRL",
isHidden: false,
images: [{url: "https://files.catbox.moe/0u6fey.jpg"}]
});
enviar("Produto criado");
} catch (b) {
console.log("erro na função comercial:", b);
enviar("[Erro] - Deu erro ao executar uma função comercial...")
}
}
break
//Atualiza informações de um produto existente 
case 'attproduto': {
try { 
const produtoAtualizado = await client.productUpdate("ID DO PRODUTO", {
name: "NEW NOME DO PRODUTO",
description: "NOVA DESCRIÇÃO",
price: "6000", // R$60,00
images: ["NOVO CAMINHO DA IMAGEM"]
});
enviar("Produto atualizado");
} catch (b) {
console.log("erro na função comercial:", b);
enviar("[Erro] - Deu erro ao executar uma função comercial...")
}
}
break
//Deleta os produtos criados
case 'delproduto': {
try { 
const deletados = await client.productDelete(["ID1", "ID2"]);
enviar("Produtos deletados");
} catch (b) {
console.log("erro na função comercial:", b);
enviar("[Erro] - Deu erro ao executar uma função comercial...")
}
}
break
//Cria uma etiqueta
case 'criaretiqueta': {
try { 
d = await client.addLabel("NOME DA ETIQUETA 🏷️");
console.log(d)
enviar("Etiqueta criada com sucesso")
} catch (b) {
console.log("erro na função comercial:", b);
enviar("[Erro] - Deu erro ao executar uma função comercial...")
}
}
break
//adiciona uma etiqueta no usuário
case 'colocarEtiqueta': {
try { 
await client.addChatLabel(sender, "ID DA ETIQUETA 🏷️");
enviar("Etiqueta adicionada com sucesso")
} catch (b) {
console.log("erro na função comercial:", b);
enviar("[Erro] - Deu erro ao executar uma função comercial...")
}
}
break
//Adiciona uma etiqueta na mensagem
case 'addetiquetamsg': {
try { 
await client.addMessageLabel(sender, "ID DA MENSAGEM", "ID DA ETIQUETA");
enviar("Etiqueta adicionada com sucesso na mensagem")
} catch (b) {
console.log("erro na função comercial:", b);
enviar("[Erro] - Deu erro ao executar uma função comercial...")
}
}
break
//======CASES ACIMA=========\\
default:
if (isCmd) {
reagir("🔴")
enviar( `Acho que você errou o comando, use ${prefix}menu é tente novamente`)
}
}
//=========IFS===========\\



//=========IF ACIMA========\\
} catch (erro) {
console.log(erro)
}})

//=======ATT CONEXÃO========\\
suc.ev.on('connection.update', (update) => {
const { connection, lastDisconnect } = update;
if (connection === 'open') {//CONEXÃO ABERTA
console.log("[ CONECTADO ] - Conexão estabelecida...")
console.log("[ LOG ] - Bot conectado com sucesso ✅")
} else if (connection === "connecting") {//TENTANDO CONECTAR
console.log(``)
console.log("[ CONEXÃO ] - Estabelecendo conexão com o whatsapp...")
} else if (connection === 'close') {//CONEXÃO FECHADA
const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
if (shouldReconnect) {
console.log('[ LOG ] - Tentando reconectar...');
ligarbot();
} else {
console.log('Desconectado. Finalizando...');
}}
})
}
ligarbot()

//========ATT INDEX========\\
fs.watchFile(__filename, (curr, prev) => {
if (curr.mtime.getTime() !== prev.mtime.getTime()) {
console.log('A index foi editada, irei reiniciar...');
process.exit()
}
})
//===========FIM=========\\
