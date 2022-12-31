# Install

Npm
```
npm i bigjpg
```

GitHub
```
npm i git+https://github.com/1Marcuth/bigjpg-js.git
```

# Simple use example
```js
import { Bigjpg, Styles, Noices, EnlargeValues } from "bigjpg/dist"

(async () => {
    const enlarger = new Bigjpg("YOUR API TOKEN HERE")

    const imageInfo = await enlarger.enlarge(
        Styles.Art, // Type of image
        Noices.None, // Noise level to be removed
        EnlargeValues._4x, // Enlargement value
        "https://avatars.githubusercontent.com/u/91915075?v=4" // Url of image to be enlarged
    )

    const imageUrl = imageInfo.getUrl() // Enlarged image url
    await imageInfo.download("enlarged-image.png") // Method to download enlarged image

    console.log(imageUrl)
})()
```