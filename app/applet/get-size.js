import https from 'https';
import sizeOf from 'image-size';

const options = {
  hostname: 'images.weserv.nl',
  path: '/?url=https://files.catbox.moe/2hv189.jpg',
};

https.get(options, function (response) {
  const chunks = [];
  response.on('data', function (chunk) {
    chunks.push(chunk);
  });
  response.on('end', function () {
    const buffer = Buffer.concat(chunks);
    try {
      const dimensions = sizeOf(buffer);
      console.log(`Width: ${dimensions.width}, Height: ${dimensions.height}`);
    } catch (e) {
      console.log("Error reading image:", e.message);
    }
  });
}).on('error', (e) => {
  console.error(e);
});
