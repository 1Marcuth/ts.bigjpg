import { Bigjpg, Styles, Noices, EnlargeValues } from "./src/index"

(async () => {
    const enlarger = new Bigjpg("634153909e7b46f68d8d1e0faa03bb37")

    const imageInfo = await enlarger.enlarge(
        Styles.Art,
        Noices.None,
        EnlargeValues._4x,
        "https://avatars.githubusercontent.com/u/91915075?v=4"
    )

    const imageUrl = imageInfo.getUrl()
    await imageInfo.download("enlarged-image.png")

    console.log(imageUrl)
})()