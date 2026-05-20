import sharp from 'sharp';

async function run() {
  const sourceFile = 'public/media-pro/azlaan-logo-trimmed.png';
  const destFile = 'app/icon.png';

  const metadata = await sharp(sourceFile).metadata();
  const { width, height } = metadata;

  if (!width || !height) {
    throw new Error('Could not retrieve image dimensions');
  }

  // Create a solid black canvas and mask it with the original logo's alpha channel (shape)
  await sharp({
    create: {
      width,
      height,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 1 }
    }
  })
  .composite([{
    input: sourceFile,
    blend: 'dest-in'
  }])
  .png()
  .toFile(destFile);

  console.log(`Successfully generated black logo favicon at ${destFile}!`);
}

run().catch(console.error);
