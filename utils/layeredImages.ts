// Function to layer images onto a canvas and return a single PNG image
export async function layerImages(imageUrls: string[]): Promise<string> {
    // Load images and wait for them to be loaded
    const images = await Promise.all(imageUrls.map(url => loadImage(url)));

    // Get the dimensions of the canvas
    const maxWidth = Math.max(...images.map(img => img.width));
    const maxHeight = Math.max(...images.map(img => img.height));

    // Create a canvas
    const canvas = document.createElement('canvas');
    canvas.width = maxWidth;
    canvas.height = maxHeight;
    const ctx = canvas.getContext('2d');

    // Draw each image onto the canvas
    images.forEach((img, index) => {
        ctx?.drawImage(img, 0, 0, img.width, img.height, 0, 0, maxWidth, maxHeight);
    });

    // Convert canvas to PNG data URL
    const dataURL = canvas.toDataURL('image/png');

    // Return the PNG data URL
    return dataURL;
}

// Function to load an image from URL
function loadImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = (error) => reject(error);
        img.src = url;
    });
}
