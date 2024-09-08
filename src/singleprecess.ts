import fs from "fs";
import { Browser, Page } from "puppeteer";
const run = async function (index: number, page: Page, browser: Browser) {
  // Khởi động trình duyệt và mở một trang trống

  // Đọc file JSON và parse nó
  const cookieFile = fs.readFileSync(
    "D:/timebucks.com_06-09-2024.json",
    "utf-8"
  );
  const cookieData = JSON.parse(cookieFile);

  // Sử dụng mảng cookies từ dữ liệu đã đọc
  const cookies = cookieData.cookies;

  // Duyệt qua từng cookie và đặt nó vào trang
  for (const cookie of cookies) {
    await page.setCookie(cookie);
  }

  // Đặt kích thước màn hình
  await page.setViewport({ width: 1080, height: 1024 });
  console.log(`Opening timebuckets (Process ${index})`);

  // Bạn có thể thực hiện thêm các hành động khác trên trang
  await page.goto(
    "https://timebucks.com/publishers/index.php?pg=earn&tab=view_content_ads"
  );

  console.log(`Opened timebuckets (Process ${index})`);

  for (let i = 0; i > -1; i++) {
    // Đợi nút hiển thị (dùng selector cho nút)
    await page.waitForSelector('input[value="View"]');
    // Đợi trang tải xong
    await page.waitForSelector(
      'span[style*="font-weight:700;font-style:italic;color:#cd0000;"]'
    );

    // Lấy nội dung văn bản của thẻ span
    const timerText = await page.$eval(
      'span[style*="font-weight:700;font-style:italic;color:#cd0000;"]',
      (element) => element.textContent
    );
    // Sử dụng regex để lấy số giây
    let seconds = 0;
    if (timerText) {
      const match = timerText.match(/\d+/);
      seconds = match ? parseInt(match[0], 10) : 0;
    }
    await page.click('input[value="View"]');

    // Chờ một chút trước khi tiếp tục với nút tiếp theo (điều chỉnh thời gian nếu cần)
    await new Promise((resolve) => setTimeout(resolve, 1000 * seconds)); // Chờ n giây
    await page.bringToFront();
    // Đợi bảng hiển thị trên trang
    await page.waitForSelector("#viewAdsTOffers1");

    // Trích xuất nội dung của thẻ <td> chứa payout (ví dụ: $0.001)
    const amout = await page.$eval(
      "#viewAdsTOffers1 tbody tr td:nth-child(3)", // Vị trí cột thứ 3 trong bảng
      (element: any) => element.textContent.trim() // Lấy nội dung văn bản và loại bỏ khoảng trắng
    );

    const pages = await browser.pages();
    if (pages.length > 1) {
      const tabToClose = pages[2]; // Tab thứ 2
      console.log(
        `Closing tab URL: ${await tabToClose.url()} (Process ${index})`
      );
      await tabToClose.close();
    }
    await page.waitForSelector("#counter2");
    // Trích xuất nội dung của thẻ <span>
    const total = await page.$eval(
      "#counter2", // Chọn phần tử có id là counter2
      (element: any) => element.textContent.trim() // Lấy nội dung văn bản và loại bỏ khoảng trắng
    );
    console.log(`Number of ads watched: ${i + 1} (Process ${index})`);

    console.log(`You earn more ${amout}. Total is ${total} (Process ${index})`);
  }
};
export default run;
