const { Jimp } = require('jimp');
const fs = require('fs');
const path = require('path');

async function sliceImage() {
  try {
    const imgPath = 'C:/Users/hp/.gemini/antigravity-ide/brain/6b4eecf6-cbb6-40f7-98e2-6b49c3b269b5/.user_uploaded/media_1789899880441.png';
    const buffer = fs.readFileSync(imgPath);
    const image = await Jimp.read(buffer);
    
    const width = image.bitmap.width;
    const height = image.bitmap.height;
    
    console.log(`Image loaded: ${width}x${height}`);
    
    // Assuming a 4x4 grid. Let's extract the top portion of each cell as the image.
    const cellWidth = Math.floor(width / 4);
    const cellHeight = Math.floor(height / 4);
    
    // The actual ring image in the screenshot usually occupies the top 70% of the cell, 
    // the bottom 30% is text/price.
    const cropHeight = Math.floor(cellHeight * 0.7);
    
    let count = 0;
    for(let row = 0; row < 4; row++) {
      for(let col = 0; col < 4; col++) {
        const x = col * cellWidth;
        const y = row * cellHeight;
        
        // Add a small margin to avoid borders
        const marginX = Math.floor(cellWidth * 0.05);
        const marginY = Math.floor(cellHeight * 0.05);
        
        const finalX = x + marginX;
        const finalY = y + marginY;
        const finalW = cellWidth - (2 * marginX);
        const finalH = cropHeight - marginY;
        
        const clone = image.clone();
        clone.crop({ x: finalX, y: finalY, w: finalW, h: finalH });
        
        const outPath = path.join(__dirname, 'public', 'images', `sliced_${count}.jpg`);
        await clone.write(outPath);
        console.log(`Saved ${outPath}`);
        count++;
      }
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

sliceImage();
