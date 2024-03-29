"use strict";
const axios = require("axios");
const fs = require("fs");
const fetch = require('node-fetch')
const chalk = require('chalk')
const moment = require('moment')
const { makeInMemoryStore } = require("@adiwajshing/baileys")
const logg = require('pino')
const time = moment(new Date()).format('HH:mm:ss DD/MM/YYYY')
const Crypto = require("crypto")
const ff = require('fluent-ffmpeg')
const webp = require("node-webpmux")
const path = require("path")
const { tmpdir } = require("os")
const sharp = require('sharp');


// exports serialize
const serialize = (mbot, msg) => {
msg.isGroup = msg.key.remoteJid.endsWith('@g.us')
try{
const berak = Object.keys(msg.message)[0]
msg.type = berak
} catch {
msg.type = null
}
try{
const context = msg.message[msg.type].contextInfo.quotedMessage
if(context["ephemeralMessage"]){
msg.quotedMsg = context.ephemeralMessage.message
}else{
msg.quotedMsg = context
}
msg.isQuotedMsg = true
msg.quotedMsg.sender = msg.message[msg.type].contextInfo.participant
msg.quotedMsg.fromMe = msg.quotedMsg.sender === mbot.user.id.split(':')[0]+'@s.whatsapp.net' ? true : false
msg.quotedMsg.type = Object.keys(msg.quotedMsg)[0]
let ane = msg.quotedMsg
msg.quotedMsg.chats = (ane.type === 'conversation' && ane.conversation) ? ane.conversation : (ane.type == 'imageMessage') && ane.imageMessage.caption ? ane.imageMessage.caption : (ane.type == 'documentMessage') && ane.documentMessage.caption ? ane.documentMessage.caption : (ane.type == 'videoMessage') && ane.videoMessage.caption ? ane.videoMessage.caption : (ane.type == 'extendedTextMessage') && ane.extendedTextMessage.text ? ane.extendedTextMessage.text : (ane.type == 'buttonsMessage') && ane.buttonsMessage.contentText ? ane.buttonsMessage.contentText : ""
msg.quotedMsg.id = msg.message[msg.type].contextInfo.stanzaId
}catch{
msg.quotedMsg = null
msg.isQuotedMsg = false
}

try{
const mention = msg.message[msg.type].contextInfo.mentionedJid
msg.mentioned = mention
}catch{
msg.mentioned = []
}
    
if (msg.isGroup){
msg.sender = msg.participant
}else{
msg.sender = msg.key.remoteJid
}
if (msg.key.fromMe){
msg.sender = mbot.user.id.split(':')[0]+'@s.whatsapp.net'
}

msg.from = msg.key.remoteJid
msg.now = msg.messageTimestamp
msg.fromMe = msg.key.fromMe

return msg
}

// exports getrandom
exports.getRandom = (ext) => {
return `${Math.floor(Math.random() * 10000)}${ext}`
}

// exports getBuffer
exports.getBuffer = async (url, options) => {
try {
options ? options : {}
const res = await axios({
method: "get",
url,
headers: {
'DNT': 1,
'Upgrade-Insecure-Request': 1
},
...options,
responseType: 'arraybuffer'
})
return res.data
} catch (e) {
console.log(`Error : ${e}`)
}
}

// exports fetchJson
exports.fetchJson = (url, options) => new Promise(async(resolve, reject) => {
fetch(url, options)
.then(response => response.json())
.then(json => {
resolve(json)
})
.catch((err) => {
reject(err)
})
})

// exports getGroupAdmins
const getGroupAdmins = function(participants){
let admins = []
for (let i of participants) {
i.admin !== null ? admins.push(i.id) : ''
}
return admins
}

// exports runtime
const runtime = function(seconds) {
seconds = Number(seconds);
var d = Math.floor(seconds / (3600 * 24));
var h = Math.floor(seconds % (3600 * 24) / 3600);
var m = Math.floor(seconds % 3600 / 60);
var s = Math.floor(seconds % 60);
var dDisplay = d > 0 ? d + (d == 1 ? " day, " : " days, ") : "";
var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
return dDisplay + hDisplay + mDisplay + sDisplay;
}

// exports sleep
exports.sleep = async (ms) => {
return new Promise(resolve => setTimeout(resolve, ms));
}

exports.makeid = (length) => {
let result = '';
const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const charactersLength = characters.length;
for (let i = 0; i < length; i++) {
result += characters.charAt(Math.floor(Math.random() *
charactersLength));
}
return result;
}

exports.bytesToSize = (bytes, decimals = 2) => {
if (bytes === 0) return '0 Bytes';
const k = 1024;
const dm = decimals < 0 ? 0 : decimals;
const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
const i = Math.floor(Math.log(bytes) / Math.log(k));
return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

exports.removeEmojis = (string) => {
var regex = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g;
return string.replace(regex, '');
}

exports.isUrl = (url) => {
return url.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/, 'gi'))
}


async function createTransparentBackground() {
  try {
    // Buat background transparan sebagai buffer
    const transparentBackground = Buffer.alloc(320 * 320 * 4); // 4 channels: RGBA (Red, Green, Blue, Alpha)
    transparentBackground.fill(0); // Set semua nilai byte menjadi 0 untuk transparan

    // Simpan background transparan sebagai file sementara
    const tmpFileOut = `./sticker/${Crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}.png`;
    await sharp(transparentBackground, { raw: { width: 320, height: 320, channels: 4 } }).toFile(tmpFileOut);

    return tmpFileOut;
  } catch (error) {
    console.error('Terjadi kesalahan:', error.message);
    throw error;
  }
}

async function imageToWebp(media) {
  try {
    // Generate nama file sementara untuk output
    const tmpFileOut = `./sticker/${Crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}.webp`;

    // Konversi gambar ke format WebP menggunakan sharp
    const image = sharp(media);
    const { width, height } = await image.metadata();

    // Hitung posisi tengah awal untuk perataan gambar di tengah sebelum resize
    const originalXPos = Math.max(0, Math.round((320 - width) / 2));
    const originalYPos = Math.max(0, Math.round((320 - height) / 2));

    // Lakukan operasi resize hanya jika gambar lebih besar dari 320x320 piksel
    if (width > 320 || height > 320) {
      // Tentukan ukuran baru gambar jika lebih besar dari 320 piksel
      const aspectRatio = width / height;
      let newWidth = width;
      let newHeight = height;

      if (width > height) {
        newWidth = 320;
        newHeight = Math.round(newWidth / aspectRatio);
      } else {
        newHeight = 320;
        newWidth = Math.round(newHeight * aspectRatio);
      }

      // Lakukan resize gambar
      await image.resize(newWidth, newHeight);

      // Hitung posisi tengah setelah resize untuk perataan gambar di tengah latar belakang transparan
      const xPos = Math.max(0, Math.round((320 - newWidth) / 2));
      const yPos = Math.max(0, Math.round((320 - newHeight) / 2));

      // Buat background transparan
      const transparentBackground = await createTransparentBackground();

      // Gabungkan gambar yang sudah diperkecil dengan background transparan
      await sharp(transparentBackground)
        .composite([{ input: await image.toBuffer(), left: xPos, top: yPos }])
        .toFormat('webp')
        .toFile(tmpFileOut);

      // Hapus file sementara background transparan setelah selesai
      fs.unlinkSync(transparentBackground);
    } else {
      // Jika gambar lebih kecil dari 320x320, langsung gabungkan dengan background transparan
      const transparentBackground = await createTransparentBackground();

      // Gabungkan gambar dengan background transparan
      await sharp(transparentBackground)
        .composite([{ input: await image.toBuffer(), left: originalXPos, top: originalYPos }])
        .toFormat('webp')
        .toFile(tmpFileOut);

      // Hapus file sementara background transparan setelah selesai
      fs.unlinkSync(transparentBackground);
    }

    // Baca hasil gambar dalam format WebP ke dalam buffer
    const buff = fs.readFileSync(tmpFileOut);

    // Hapus file sementara hasil gambar setelah selesai
    fs.unlinkSync(tmpFileOut);

    // Kembalikan buffer gambar dalam format WebP
    return buff;
  } catch (error) {
    console.error('Terjadi kesalahan:', error.message);
    throw error;
  }
}



async function videoToWebp (media) {

    const tmpFileOut = `./sticker/${Crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}.webp`
    const tmpFileIn = `./sticker/${Crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}.mp4`

    fs.writeFileSync(tmpFileIn, media)

    await new Promise((resolve, reject) => {
        ff(tmpFileIn)
            .on("error", reject)
            .on("end", () => resolve(true))
            .addOutputOptions([
                "-vcodec",
                "libwebp",
                "-vf",
                "scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse",
                "-loop",
                "0",
                "-ss",
                "00:00:00",
                "-t",
                "00:00:05",
                "-preset",
                "default",
                "-an",
                "-vsync",
                "0"
            ])
            .toFormat("webp")
            .save(tmpFileOut)
    })

    const buff = fs.readFileSync(tmpFileOut)
    fs.unlinkSync(tmpFileOut)
    fs.unlinkSync(tmpFileIn)
    return buff
}

async function writeExifImg (media, metadata) {
    let wMedia = await imageToWebp(media)
    const tmpFileIn = `./sticker/${Crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}.webp`
    const tmpFileOut = `./sticker/${Crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}.webp`
    fs.writeFileSync(tmpFileIn, wMedia)

    if (metadata.packname || metadata.author) {
        const img = new webp.Image()
        const json = { "sticker-pack-id": `https://github.com/rtwone/chitandabot`, "sticker-pack-name": metadata.packname, "sticker-pack-publisher": metadata.author, "emojis": metadata.categories ? metadata.categories : [""] }
        const exifAttr = Buffer.from([0x49, 0x49, 0x2A, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x41, 0x57, 0x07, 0x00, 0x00, 0x00, 0x00, 0x00, 0x16, 0x00, 0x00, 0x00])
        const jsonBuff = Buffer.from(JSON.stringify(json), "utf-8")
        const exif = Buffer.concat([exifAttr, jsonBuff])
        exif.writeUIntLE(jsonBuff.length, 14, 4)
        await img.load(tmpFileIn)
        fs.unlinkSync(tmpFileIn)
        img.exif = exif
        await img.save(tmpFileOut)
        return tmpFileOut
    }
}

async function writeExifVid (media, metadata) {
    let wMedia = await videoToWebp(media)
    const tmpFileIn = `./sticker/${Crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}.webp`
    const tmpFileOut = `./sticker/${Crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}.webp`
    fs.writeFileSync(tmpFileIn, wMedia)

    if (metadata.packname || metadata.author) {
        const img = new webp.Image()
        const json = { "sticker-pack-id": `https://github.com/rtwone/chitandabot`, "sticker-pack-name": metadata.packname, "sticker-pack-publisher": metadata.author, "emojis": metadata.categories ? metadata.categories : [""] }
        const exifAttr = Buffer.from([0x49, 0x49, 0x2A, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x41, 0x57, 0x07, 0x00, 0x00, 0x00, 0x00, 0x00, 0x16, 0x00, 0x00, 0x00])
        const jsonBuff = Buffer.from(JSON.stringify(json), "utf-8")
        const exif = Buffer.concat([exifAttr, jsonBuff])
        exif.writeUIntLE(jsonBuff.length, 14, 4)
        await img.load(tmpFileIn)
        fs.unlinkSync(tmpFileIn)
        img.exif = exif
        await img.save(tmpFileOut)
        return tmpFileOut
    }
}


const Memory_Store = makeInMemoryStore({ logger: logg().child({ level: 'fatal', stream: 'store' }) })

module.exports = { writeExifImg, writeExifVid, Memory_Store, serialize, runtime, getGroupAdmins}