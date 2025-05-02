import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";
import Image from "next/image";

const SellerButton = ({ seller, sellerId } : any) => {
  const router = useRouter();

  return (
    <div
      className="mt-6 flex items-center justify-between bg-[#EBEBEB] p-2 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition"
      onClick={() => router.push(`/seller/${sellerId}`)}
    >
      {/* Profile Image & Info */}
      <div className="flex items-center space-x-4">
        <Image
          src={seller.profileImage}
          alt={seller.username}
          height={70}
          width={45}
          className="rounded-full object-cover h-[50px]"
          unoptimized
        />
        <div>
          <p className="text-gray-900 text-lg font-semibold">{seller.username}</p>
          <div className="flex items-center text-yellow-500">
            {"★".repeat(Math.floor(seller.rating))}
            {"☆".repeat(5 - Math.floor(seller.rating))}
            <span className="text-gray-900 text-sm ml-2">{seller.reviews}</span>
          </div>
        </div>
      </div>

      {/* Arrow Icon */}
      <ChevronRight size={25} className={"text-gray-900"} />
    </div>
  );
};

export default SellerButton;
