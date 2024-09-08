import run from "./singleprecess";
import puppeteer from "puppeteer";
(async () => {
  // for (let index = 0; index < 1; index++) {
  //   let isFall = true;
  //   while (isFall) {
  //     try {
  //       await run(index + 1);
  //       isFall = false;
  //     } catch (error) {
  //       isFall = true;
  //       console.log("Reconnect after 1 miniute");
  //       await new Promise((resolve) => setTimeout(resolve, 60000));
  //     }
  //   }
  // }
  const index = 0;
  let isFall = true;
  while (isFall) {
    const browser = await puppeteer.launch({
      headless: true,
      // args: [`--proxy-server=1.52.48.25:11111`],
      timeout: 60000000,
    });
    const page = await browser.newPage();
    try {
      await run(index + 1, page, browser);
      isFall = false;
    } catch (error) {
      console.log(error);
      isFall = true;
      console.log("Reconnect after 1 miniute");
      await browser.close();
      await new Promise((resolve) => setTimeout(resolve, 60000));
    }
  }
})();
