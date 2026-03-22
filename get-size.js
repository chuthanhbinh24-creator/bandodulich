import https from 'https';
import sizeOf from 'image-size';

https.get('https://files.catbox.moe/2hv189.jpg', function (response) {
  const chunks = [];
  response.on('data', function (chunk) {
    chunks.push(chunk);
  });
  response.on('end', function () {
    const buffer = Buffer.concat(chunks);
    const dimensions = sizeOf(buffer);
    console.log(`Width: ${dimensions.width}, Height: ${dimensions.height}`);
  });
});
