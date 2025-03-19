import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";
import Image from "next/image";

const SellerButton = ({ seller } : any) => {
  const router = useRouter();

  return (
    <div
      className="mt-5 flex items-center justify-between bg-[#EBEBEB] p-4 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition"
      onClick={() => router.push(`/seller`)}
    >
      {/* Profile Image & Info */}
      <div className="flex items-center space-x-4">
        <Image
          src={seller.profileImage}
          alt={seller.username}
          height={120}
          width={90}
          layout="insintric"
          className="rounded-full object-cover"
        />
        <div>
          <p className="text-gray-900 text-2xl font-semibold">{seller.username}</p>
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
