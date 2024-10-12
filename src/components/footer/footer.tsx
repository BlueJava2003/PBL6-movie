import { memo } from 'react';

function Footer() {
  return (
    <footer className="bg-black text-[#90A4AE] border-t border-blue-gray-400 text-center text-sm lg:text-[15px] lg:text-center">
      {/* <div className="bg-[#0e1d2f] p-6 flex justify-center">
        <div className="flex gap-6 text-white">
          <img src="/assets/icon_facebook.png" alt="" />
          <img src="/assets/icon_instagram.png" alt="" />
          <img src="/assets/icon_youtube.png" alt="" />
        </div>
      </div> */}
      <div className="px-6 pt-[100px] w-full">
        <div className="grid lg:grid-cols-4 md:grid-cols-2">
          <div className="mb-6">
            <h5 className="uppercase font-bold mb-2.5">Thông tin người dùng</h5>

            <ul className="list-none mb-0">
              <li>
                <a href="#!">Câu hỏi thường gặp</a>
              </li>
              <li>
                <a href="#!">Quan hệ nhà đầu tư</a>
              </li>
              <li>
                <a href="#!">Quyền riêng tư</a>
              </li>
              <li>
                <a href="#!">Kiểm tra tốc độ</a>
              </li>
            </ul>
          </div>

          <div className="mb-6">
            <h5 className="uppercase font-bold mb-2.5 text-zinc-400">Trợ giúp</h5>

            <ul className="list-none mb-0">
              <li>
                <a href="#!">Trung tâm trợ giúp</a>
              </li>
              <li>
                <a href="#!">Tùy chọn cookie</a>
              </li>
              <li>
                <a href="#!">Thông báo pháp lý</a>
              </li>
            </ul>
          </div>

          <div className="mb-6">
            <h5 className="uppercase font-bold mb-2.5 text-zinc-400">Về chúng tôi</h5>

            <ul className="list-none mb-0">
              <li>
                <a href="#!">Đặt vé</a>
              </li>
              <li>
                <a href="#!">Giá vé</a>
              </li>
              <li>
                <a href="#!">Lịch chiếu</a>
              </li>
              <li>
                <a href="#!">Sự kiện khuyến mãi</a>
              </li>
            </ul>
          </div>

          <div className="mb-6">
            <h5 className="uppercase font-bold mb-2.5 text-zinc-400">Mạng xã hội</h5>

            <ul className="list-none mb-0">
              <li>
                <a href="#!">Tài khoản</a>
              </li>
              <li>
                <a href="#!">Thông tin doanh nghiệp</a>
              </li>
              <li>
                <a href="#!">Trung tâm đa phương tiện</a>
              </li>
              <li>
                <a href="#!">Liện hệ</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="text-gray-700 text-center p-4">
        © 2024 Copyright -&ensp;
        <a href="https://tailwind-elements.com/">Pul React</a>
      </div>
    </footer>
  );
}

export default memo(Footer);
