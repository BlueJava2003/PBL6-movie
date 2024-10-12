const History = () => {
  return (
    <div className="bg-[#030303]">
      <div className="lg:px-16 px-5 py-16 text-white min-h-screen max-h-full w-full">
        <button
          disabled
          className="text-white text-sm lg:text-[15px] pr-6 py-[10px] mb-6 border-b-[3px] border-[#E50914]"
        >
          VÉ ĐÃ ĐẶT GẦN ĐÂY
        </button>
        <div
          style={{
            backgroundImage: `url("https://images2.thanhnien.vn/528068263637045248/2024/6/10/h1-1717998302778537834919.jpeg")`,
          }}
          className="bg-center bg-cover rounded-lg"
          data-aos="fade-left"
          data-aos-duration="1000"
        >
          <div className="bg-gradient-to-r from-black/90 to-black/40 text-sm w-full text-white mt-5 px-2 lg:px-3 py-1 lg:py-3">
            <div className="bg-transparent">
              <div className="grid grid-cols-3 lg:px-2">
                <div className="lg:flex lg:items-center justify-start col-span-2">
                  <h1 className="lg:mr-5 mr-0 lg:ml-3 ml-0 pt-2 text-sm lg:text-[15px] ">
                    Phim:{' '}
                    <span className="text-white font-thin text-[12px] lg:text-[15px] uppercase">
                      <p className="truncate">Gia tài của ngoại</p>
                    </span>
                  </h1>
                  <h2 className="lg:ml-5 lg:pt-2 text-sm lg:text-[15px] ">
                    Phòng chiếu:{' '}
                    <span className="text-white font-thin">
                      <p className="truncate">01</p>
                    </span>
                  </h2>
                  <h2 className="lg:ml-5 lg:pt-2 text-sm lg:text-[15px] ">
                    Ngày đặt:{' '}
                    <span className="text-white font-thin">
                      <p className="truncate">21-07-2024</p>
                    </span>
                  </h2>
                </div>
                <div className="flex items-center justify-end">
                  <h1 className="mx-2 text-sm lg:text-[15px] hidden lg:block">
                    Hủy vé đặt
                  </h1>
                  <button
                    // onClick={() => handleOpen('lg', reservation._id)}
                    className=" bg-[#c40404] font-bold p-2 text-[12px] rounded-full"
                  >
                    Hủy
                  </button>
                </div>
              </div>
              <div className="bg-black/70 rounded-lg">
                <div className="bg-transparent grid grid-cols-5 lg:grid-cols-6 gap-x-1 mt-5 lg:px-5 px-2 py-1 lg:py-2">
                  <div>
                    <h3 className="text-sm ml-2 lg:ml-0 lg:text-[15px] text-gray-500">
                      Ngày chiếu
                    </h3>
                    <p className="text-[12px] font-thin lg:text-[15px]">21-07-2024</p>
                  </div>
                  <div className="sm:text-center lg:text-left">
                    <h3 className="text-sm lg:text-[15px] text-gray-500">Giờ chiếu</h3>
                    <p className="text-[12px] font-thin lg:text-[15px]">15:00</p>
                  </div>
                  <div className="px-0 lg:mx-0">
                    <h3 className="text-sm lg:text-[15px] text-gray-500">Loại vé</h3>
                    <p className="text-[12px] font-thin lg:text-[15px]">
                      {/* {reservation.tickets.map(
                        (ticket) =>
                          ticket.quantity > 0 && (
                            <span key={ticket._id}>
                              {ticket.typeTicket} &#40;x
                              {ticket.quantity}
                              &#41;&ensp;
                            </span>
                          )
                      )} */}
                      ve vip
                    </p>
                  </div>
                  <div className="text-center">
                    <h3 className="text-sm lg:text-[15px] text-gray-500">Ghế</h3>
                    <p className="text-[12px] lg:text-[15px] font-thin">G6,F7</p>
                  </div>
                  <div className="col-span-2 lg:text-end">
                    <h3 className="text-sm lg:text-[15px] text-gray-500">
                      Tống thanh toán
                    </h3>
                    <p className="font-bold text-[15px] lg:text-[17px]">
                      {/* {reservation.total.toLocaleString('vi', {
                        style: 'currency',
                        currency: 'VND',
                      })} */}
                      20000
                    </p>
                    <p className="text-[12px] lg:text-sm text-green-800">Đã thanh toán</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default History;
