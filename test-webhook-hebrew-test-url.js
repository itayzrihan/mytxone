#!/usr/bin/env node

/**
 * Test webhook with proper UTF-8 encoding for Hebrew text
 * Uses TEST URL to avoid activation requirement
 */

const https = require('https');

const payload = {
  driveLink: "https://drive.google.com/file/d/14kHeQitAZgg0BDRfPkb_e5h1VJpAWDEp/view?usp=drive_link",
  title: "כוחה של הזהות",
  caption: "כוחה של הזהות – למה הדרך שבה אתה מגדיר את עצמך קובעת את התוצאות שלך."
};

const data = JSON.stringify(payload, null, 2);

console.log("📤 Sending request with Hebrew text to TEST URL...\n");
console.log("Request Body:");
console.log(data);
console.log("");

const options = {
  hostname: 'auto.mytx.co',
  port: 443,
  path: '/webhook/post-to-social',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(data, 'utf8')
  }
};

const req = https.request(options, (res) => {
  let responseData = '';

  res.on('data', (chunk) => {
    responseData += chunk;
  });

  res.on('end', () => {
    console.log(`✅ Response Status: ${res.statusCode}\n`);
    console.log("Response Content:");
    console.log(responseData);
    console.log("");
    
    try {
      const json = JSON.parse(responseData);
      console.log("📋 Parsed Response:");
      console.log(JSON.stringify(json, null, 2));
    } catch (e) {
      // Response is not JSON
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Error:', error);
});

// Write the data to the request body
req.write(data, 'utf8');
req.end();
