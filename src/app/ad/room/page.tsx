import RoomList from "@/components/ad/room/room-page/roomList";
import { Button } from "antd";
import Link from "next/link";

const roomPage = async () => {
    return (
        <>
            <Link href="/createRoom">
                    <Button
                        className="md:mx-3 mx-2 text-[13px] lg:text-[15px] py-[16px] uppercase border-[#E50914]"
                    >
                        Create Room
                    </Button>
                </Link>
            <RoomList/>
        </>
    )
}

export default roomPage;