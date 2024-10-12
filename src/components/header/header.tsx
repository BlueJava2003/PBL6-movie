'use client';
// IMPORT HOOKS
import React, { useState, useEffect, memo } from 'react';
// IMPORT UI
import Link from 'next/link';
// import { Transition } from '@headlessui/react';
import { Menu, MenuHandler, MenuList, MenuItem, Button } from '@material-tailwind/react';
import { Dropdown, MenuProps, Space } from 'antd';
import { DownOutlined, SmileOutlined } from '@ant-design/icons';
import { useCookies } from 'next-client-cookies';
import { useUserContext } from '@/lib/user.wrapper';
import { sendRequest } from '../../../utils/api';

function Header() {
  // DEFINE
  const cookies = useCookies();
  const accessToken = cookies.get('accessToken');
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser, setCurrentUser } = useUserContext() as IUserContext;

  const handleLogout = async () => {
    const res = await sendRequest<IBackendRes<IUser>>({
      url: `${process.env.customURL}/auth/logout`,
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    cookies.remove('accessToken');
    cookies.remove('refreshToken');
    localStorage.removeItem('scheduleId');
    setCurrentUser({
      accessToken: '',
      refresh_token: '',
      name: '',
    });
  };

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <div className="px-5 text-left text-[18px] font-semibold">
          <Link href="#" className="text-primary hover:text-[#E50914]">
            Profile
          </Link>
        </div>
      ),
    },
    {
      key: '2',
      label: (
        <div
          className="px-5 text-left text-primary text-[18px] font-semibold hover:text-[#E50914]"
          onClick={handleLogout}
        >
          Đăng xuất
        </div>
      ),
    },
  ];

  return (
    <div>
      <nav className="bg-black">
        <div className="max-w-screen-lg mx-auto px-3 md:px-4 sm:px-6 lg:px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex-shrink-0">
              <Link href="/">
                <img
                  className="lg:h-8 lg:w-[150px] h-5 w-[100px]"
                  src="/assets/logo.png"
                  alt="Workflow"
                />
              </Link>
            </div>
            <div className="hidden lg:block">
              <div className="ml-10 flex items-baseline space-x-5">
                <Link
                  href="/schedule"
                  className="text-white hover:bg-[#E50914] hover:text-white px-3 py-2 rounded-md text-[18px] font-medium uppercase"
                >
                  Lịch chiếu
                </Link>
                <Link
                  href="/movie"
                  className="text-white hover:bg-[#E50914] hover:text-white px-3 py-2 rounded-md text-[18px] font-medium uppercase"
                >
                  Phim
                </Link>
                <Link
                  href="#"
                  className="text-white hover:bg-[#E50914] hover:text-white px-3 py-2 rounded-md text-[18px] font-medium uppercase"
                >
                  Ưu đãi
                </Link>
                <Link
                  href="#"
                  className="text-white hover:bg-[#E50914] hover:text-white px-3 py-2 rounded-md text-[18px] font-medium uppercase"
                >
                  Tin tức phim
                </Link>
                <Link
                  href="#"
                  className="text-white hover:bg-[#E50914] hover:text-white px-3 py-2 rounded-md text-[18px] font-medium uppercase"
                >
                  Thành viên
                </Link>
              </div>
            </div>
            <div className="flex items-center gap-5">
              {accessToken ? (
                <div className="pl-14">
                  <Dropdown menu={{ items }}>
                    <a onClick={(e) => e.preventDefault()}>
                      <Space className="!text-[#7e8eaa] !hover:text-[#E50914] !text-[18px] !font-medium">
                        {currentUser.name}
                        <DownOutlined />
                      </Space>
                    </a>
                  </Dropdown>
                </div>
              ) : (
                <div className="pl-14">
                  <Link
                    href="/auth/login"
                    className="text-[#7e8eaa] hover:text-[#E50914] text-[14px] font-medium uppercase"
                  >
                    Đăng nhập/
                  </Link>
                  <Link
                    href="/auth/register"
                    className="text-[#7e8eaa] hover:text-[#E50914] text-[14px] font-medium uppercase"
                  >
                    Đăng ký
                  </Link>
                </div>
              )}

              <div className="mr-0 flex lg:hidden">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  type="button"
                  className="bg-transparent inline-flex items-center justify-center p-2 rounded-md text-gray-200 hover:text-white hover:bg-gray-800 focus:outline-none "
                  aria-controls="mobile-menu"
                  aria-expanded="false"
                >
                  <span className="sr-only">Open main menu</span>
                  {!isOpen ? (
                    <svg
                      className="block h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="block h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="z-50">
          <div className={` ${isOpen ? `block` : `hidden`}`}>
            <div className="lg:hidden" id="mobile-menu">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                <Link
                  href="/schedule"
                  className="hover:bg-gray-700 text-white block px-3 py-[2px] rounded-md text-[18px] font-medium"
                >
                  LỊCH CHIẾU
                </Link>

                <Link
                  href="/movie"
                  className="text-white hover:bg-gray-700 hover:text-white block px-3 py-[2px] rounded-md text-[18px] font-medium"
                >
                  PHIM
                </Link>

                <Link
                  href="#"
                  className="text-white hover:bg-gray-700 hover:text-white block px-3 py-[2px] rounded-md text-[18px] font-medium"
                >
                  ƯU ĐÃI
                </Link>

                <Link
                  href="/blog&event"
                  className="text-white hover:bg-gray-700 hover:text-white block px-3 py-[2px] rounded-md text-[18px] font-medium"
                >
                  TIN TỨC
                </Link>

                <Link
                  href="#"
                  className="text-white hover:bg-gray-700 hover:text-white block px-3 py-[2px] rounded-md text-[18px] font-medium"
                >
                  THÀNH VIÊN
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default memo(Header);
