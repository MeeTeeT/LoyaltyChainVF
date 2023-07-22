//import axie from "../tile.jpeg";
import { BrowserRouter as Router, Link } from "react-router-dom";
import { GetIpfsUrlFromPinata } from "../utils";

function NFTTile(data) {
  const newTo = {
    pathname: "/nftPage/" + data.data.tokenId,
  };

  const IPFSUrl = GetIpfsUrlFromPinata(data.data.image);

  return (
    <Link to={newTo}>
      <div class="mb-6 lg:mb-0 max-w-xs">
        <div class="relative block  border-slate-300 border rounded-xl bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-primary-700">
          <div class="flex">
            <div
              class="relative mx-4 -mt-4 w-full overflow-hidden rounded-lg bg-cover bg-no-repeat shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)]"
              data-te-ripple-init
              data-te-ripple-color="light"
            >
              <img
                src={IPFSUrl}
                class="object-fill w-full aspect-square object-contain border-slate-300 border rounded-xl"
              />
              <a href="#!">
                <div class="absolute top-0 right-0 bottom-0 left-0 h-full w-full overflow-hidden bg-[hsl(0,0%,98.4%,0.15)] bg-fixed opacity-0 transition duration-300 ease-in-out hover:opacity-100"></div>
              </a>
            </div>
          </div>
          <div class="pl-6 pt-2">
            <h5 class="mb-2 text-lg font-bold">{data.data.name}</h5>
            <p class="mb-4 text-sm font-light">{data.data.description}</p>
            <hr class="my-3 h-px border-t-0 bg-transparent bg-gradient-to-r from-transparent via-slate-300 to-transparent opacity-25 dark:opacity-100" />
            <div class="flex justify-between">
              <div class="mb-4 mt-1  text-sm font-light">Asking Price</div>

              <div class="mb-2 text-lg font-bold mr-6">
                {data.data.price}{" "}
                <span class="mb-2 text-xs font-light">ETH</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/*
            <div class="w-72 bg-white shadow-md rounded-xl duration-500 hover:scale-105 hover:shadow-xl">
        <a href="#">
            <img src={IPFSUrl}
                    alt="Product" class="h-80 w-72 object-cover rounded-t-xl" />
            <div class="px-4 py-3 w-72">
                <span class="text-gray-400 mr-3 uppercase text-xs">Brand</span>
                <p class="text-lg font-bold text-black truncate block capitalize">{data.data.description}</p>
                <div class="flex items-center">
                    <p class="text-lg font-semibold text-black cursor-auto my-3">ETH {data.data.price}</p>
                    
                    <div class="ml-auto"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                            fill="currentColor" class="bi bi-bag-plus" viewBox="0 0 16 16">
                            <path fill-rule="evenodd"
                                d="M8 7.5a.5.5 0 0 1 .5.5v1.5H10a.5.5 0 0 1 0 1H8.5V12a.5.5 0 0 1-1 0v-1.5H6a.5.5 0 0 1 0-1h1.5V8a.5.5 0 0 1 .5-.5z" />
                            <path
                                d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1zm3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4h-3.5zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5z" />
                        </svg></div>
                </div>
            </div>
        </a>
    </div>
    */}
    </Link>
  );
}

export default NFTTile;
