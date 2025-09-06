

const CommentCard = () => {
    return (
        <section className="py-24 relative">
            <div className="w-full max-w-7xl px-4 md:px-5 lg:px-5 mx-auto">
                <div className="w-full flex-col justify-start items-start lg:gap-10 gap-6 inline-flex">
                    <h2 className="text-gray-900 text-3xl font-bold font-manrope leading-normal">200+ Comments</h2>
                    <div className="w-full flex-col justify-start items-start lg:gap-9 gap-6 flex">
                        <div className="w-full relative flex justify-between gap-2">
                            <input type="text"
                                className="w-full py-3 px-5 rounded-lg border border-gray-300 bg-white shadow-[0px_1px_2px_0px_rgba(16,_24,_40,_0.05)] focus:outline-none text-gray-900 placeholder-gray-400 text-lg font-normal leading-relaxed"
                                placeholder="Write comments here...." />
                            <a href="" className="absolute right-6 top-[18px]">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"
                                    fill="none">
                                    <path
                                        d="M11.3011 8.69906L8.17808 11.8221M8.62402 12.5909L8.79264 12.8821C10.3882 15.638 11.1859 17.016 12.2575 16.9068C13.3291 16.7977 13.8326 15.2871 14.8397 12.2661L16.2842 7.93238C17.2041 5.17273 17.6641 3.79291 16.9357 3.06455C16.2073 2.33619 14.8275 2.79613 12.0679 3.71601L7.73416 5.16058C4.71311 6.16759 3.20259 6.6711 3.09342 7.7427C2.98425 8.81431 4.36221 9.61207 7.11813 11.2076L7.40938 11.3762C7.79182 11.5976 7.98303 11.7083 8.13747 11.8628C8.29191 12.0172 8.40261 12.2084 8.62402 12.5909Z"
                                        stroke="#111827" stroke-width="1.6" stroke-linecap="round" />
                                </svg>
                            </a>
                        </div>
                        <div className="w-full flex-col justify-start items-start gap-8 flex">
                            <div className="w-full flex-col justify-start items-end gap-5 flex">
                                <div
                                    className="w-full p-6 bg-white rounded-2xl border border-gray-200 flex-col justify-start items-start gap-8 flex">
                                    <div className="w-full flex-col justify-center items-start gap-3.5 flex">
                                        <div className="w-full justify-between items-center inline-flex">
                                            <div className="justify-start items-center gap-2.5 flex">
                                                <div
                                                    className="w-10 h-10 bg-gray-300 rounded-full justify-start items-start gap-2.5 flex">
                                                    <img className="rounded-full object-cover" src="https://pagedone.io/asset/uploads/1714988283.png"
                                                        alt="Jenny wilson image" />
                                                </div>
                                                <div className="flex-col justify-start items-start gap-1 inline-flex">
                                                    <h5 className="text-gray-900 text-sm font-semibold leading-snug">Jenny
                                                        Wilson</h5>
                                                    <h6 className="text-gray-500 text-xs font-normal leading-5">1 hr ago</h6>
                                                </div>
                                            </div>
                                            <div className="w-6 h-6 relative">
                                                <div className="w-full h-fit flex">
                                                    <div className="relative w-full">
                                                        <div className=" absolute left-0 top-0 py-2.5 px-4 text-gray-300"></div>
                                                        <button id="dropdown-button" data-target="dropdown-1"
                                                            className="w-full justify-center dropdown-toggle flex-shrink-0 z-10 flex items-center text-base font-medium text-center text-gray-900 bg-transparent  absolute right-0 top-0"
                                                            type="button">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                                viewBox="0 0 24 24" fill="none">
                                                                <path
                                                                    d="M12.0161 16.9893V17.0393M12.0161 11.9756V12.0256M12.0161 6.96191V7.01191"
                                                                    stroke="black" stroke-width="2.5"
                                                                    stroke-linecap="round" />
                                                            </svg>
                                                        </button>
                                                        <div id="dropdown-1"
                                                            className="absolute top-10 right-0 z-20 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 open hidden">
                                                            <ul className="py-2 text-sm text-gray-700 dark:text-gray-200"
                                                                aria-labelledby="dropdown-button">
                                                                <li>
                                                                    <a href="#"
                                                                        className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Edit</a>
                                                                </li>
                                                                <li>
                                                                    <a href="#"
                                                                        className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Save</a>
                                                                </li>
                                                                <li>
                                                                    <a href="#"
                                                                        className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Delete</a>
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-gray-800 text-sm font-normal leading-snug">This novel's character
                                            development is outstanding! The protagonist's journey is so well-crafted and
                                            realistic. I felt like I was growing along with them as I read.</p>
                                    </div>
                                    <div className="w-full justify-between items-center inline-flex">
                                        <div className="justify-start items-center gap-4 flex">
                                            <div className="justify-start items-center gap-1.5 flex">
                                                <a href="">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                        viewBox="0 0 24 24" fill="none">
                                                        <path
                                                            d="M7.04962 9.99504L7 10M12 10L11.9504 10.005M17 10L16.9504 10.005M10.5 3H13.5C16.7875 3 18.4312 3 19.5376 3.90796C19.7401 4.07418 19.9258 4.25989 20.092 4.46243C21 5.56878 21 7.21252 21 10.5V12.4777C21 13.8941 21 14.6023 20.8226 15.1779C20.4329 16.4427 19.4427 17.4329 18.1779 17.8226C17.6023 18 16.8941 18 15.4777 18C15.0811 18 14.8828 18 14.6985 18.0349C14.2966 18.1109 13.9277 18.3083 13.6415 18.6005C13.5103 18.7345 13.4003 18.8995 13.1803 19.2295L13.1116 19.3326C12.779 19.8316 12.6126 20.081 12.409 20.198C12.1334 20.3564 11.7988 20.3743 11.5079 20.2462C11.2929 20.1515 11.101 19.9212 10.7171 19.4605L10.2896 18.9475C10.1037 18.7244 10.0108 18.6129 9.90791 18.5195C9.61025 18.2492 9.23801 18.0748 8.83977 18.0192C8.70218 18 8.55699 18 8.26662 18C7.08889 18 6.50002 18 6.01542 17.8769C4.59398 17.5159 3.48406 16.406 3.12307 14.9846C3 14.5 3 13.9111 3 12.7334V10.5C3 7.21252 3 5.56878 3.90796 4.46243C4.07418 4.25989 4.25989 4.07418 4.46243 3.90796C5.56878 3 7.21252 3 10.5 3Z"
                                                            stroke="black" stroke-width="1.6" stroke-linecap="round" />
                                                    </svg>
                                                </a>
                                                <h5 className="text-gray-900 text-sm font-normal leading-snug">2 Replies</h5>
                                            </div>
                                            <div className="justify-start items-center gap-1.5 flex">
                                                <a href="">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                        viewBox="0 0 24 24" fill="none">
                                                        <path
                                                            d="M16 14C16 15.6569 14 17 12 17C10 17 8 15.6569 8 14M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12ZM10 9C10 9.55228 9.55228 10 9 10C8.44772 10 8 9.55228 8 9C8 8.44772 8.44772 8 9 8C9.55228 8 10 8.44772 10 9ZM16 9C16 9.55228 15.5523 10 15 10C14.4477 10 14 9.55228 14 9C14 8.44772 14.4477 8 15 8C15.5523 8 16 8.44772 16 9Z"
                                                            stroke="#111827" stroke-width="1.6" stroke-linecap="round" />
                                                    </svg>
                                                </a>
                                                <h5 className="text-gray-900 text-sm font-normal leading-snug">Reactions</h5>
                                            </div>
                                        </div>
                                        <div className="justify-end items-center gap-1 flex">
                                            <h5 className="text-gray-500 text-sm font-normal leading-snug">30</h5>
                                            <div className="justify-start items-start flex -space-x-2 overflow-hidden">
                                                <div
                                                    className="p-1.5 inline-block ring-1 ring-white bg-gray-100 rounded-full border border-white justify-center items-center flex">
                                                    <img className="w-3 h-3"
                                                        src="https://pagedone.io/asset/uploads/1716545141.png"
                                                        alt="Thumbs Up emoji" />
                                                </div>
                                                <div
                                                    className="p-1.5 inline-block ring-1 ring-white bg-gray-100 rounded-full border border-white justify-center items-center flex">
                                                    <img className="w-3 h-3"
                                                        src="https://pagedone.io/asset/uploads/1716545183.png"
                                                        alt="Smiling eyes emoji" />
                                                </div>
                                                <div
                                                    className="p-1.5 inline-block ring-1 ring-white bg-gray-100 rounded-full border border-white justify-center items-center flex">
                                                    <img className="w-3 h-3"
                                                        src="https://pagedone.io/asset/uploads/1716545217.png"
                                                        alt="hugging face emoji" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div
                                    className="w-full lg:pl-60 md:pl-20 sm:pl-10 pl-7 flex-col justify-start items-end gap-2.5 flex">
                                    <div
                                        className="w-full p-6 bg-gray-50 rounded-2xl border border-gray-200 flex-col justify-start items-start gap-8 flex">
                                        <div className="w-full flex-col justify-center items-start gap-3.5 flex">
                                            <div className="w-full justify-between items-center inline-flex">
                                                <div className="justify-start items-center gap-2.5 flex">
                                                    <div
                                                        className="w-10 h-10 bg-stone-300 rounded-full justify-start items-start gap-2.5 flex">
                                                        <img className="rounded-full object-cover" src="https://pagedone.io/asset/uploads/1710225753.png"
                                                            alt="Kevin Patel image" />
                                                    </div>
                                                    <div className="flex-col justify-start items-start gap-1 inline-flex">
                                                        <h5 className="text-gray-900 text-sm font-semibold leading-snug">Kevin
                                                            Patel</h5>
                                                        <h6 className="text-gray-500 text-xs font-normal leading-5">60 mins ago
                                                        </h6>
                                                    </div>
                                                </div>
                                                <div className="w-6 h-6 relative">
                                                    <div className="w-full h-fit flex">
                                                        <div className="relative w-full">
                                                            <div className=" absolute left-0 top-0 py-2.5 px-4 text-gray-300">
                                                            </div>
                                                            <button id="dropdown-button" data-target="dropdown-2"
                                                                className="w-full justify-center dropdown-toggle flex-shrink-0 z-10 flex items-center text-base font-medium text-center text-gray-900 bg-transparent  absolute right-0 top-0"
                                                                type="button">
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="24"
                                                                    height="24" viewBox="0 0 24 24" fill="none">
                                                                    <path
                                                                        d="M12.0161 16.9893V17.0393M12.0161 11.9756V12.0256M12.0161 6.96191V7.01191"
                                                                        stroke="black" stroke-width="2.5"
                                                                        stroke-linecap="round" />
                                                                </svg>
                                                            </button>
                                                            <div id="dropdown-2"
                                                                className="absolute top-10 right-0 z-20 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 open hidden">
                                                                <ul className="py-2 text-sm text-gray-700 dark:text-gray-200"
                                                                    aria-labelledby="dropdown-button">
                                                                    <li>
                                                                        <a href="#"
                                                                            className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Edit</a>
                                                                    </li>
                                                                    <li>
                                                                        <a href="#"
                                                                            className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Save</a>
                                                                    </li>
                                                                    <li>
                                                                        <a href="#"
                                                                            className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Delete</a>
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <p className="text-gray-800 text-sm font-normal leading-snug">Absolutely! I was
                                                amazed at how much they grew throughout the story. The way the author
                                                portrayed their struggles and triumphs was truly inspiring.</p>
                                        </div>
                                        <div className="w-full justify-between items-center inline-flex">
                                            <div className="justify-start items-center gap-4 flex">
                                                <div className="justify-start items-center gap-1.5 flex">
                                                    <a href="">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                            viewBox="0 0 24 24" fill="none">
                                                            <path
                                                                d="M7.04962 9.99504L7 10M12 10L11.9504 10.005M17 10L16.9504 10.005M10.5 3H13.5C16.7875 3 18.4312 3 19.5376 3.90796C19.7401 4.07418 19.9258 4.25989 20.092 4.46243C21 5.56878 21 7.21252 21 10.5V12.4777C21 13.8941 21 14.6023 20.8226 15.1779C20.4329 16.4427 19.4427 17.4329 18.1779 17.8226C17.6023 18 16.8941 18 15.4777 18C15.0811 18 14.8828 18 14.6985 18.0349C14.2966 18.1109 13.9277 18.3083 13.6415 18.6005C13.5103 18.7345 13.4003 18.8995 13.1803 19.2295L13.1116 19.3326C12.779 19.8316 12.6126 20.081 12.409 20.198C12.1334 20.3564 11.7988 20.3743 11.5079 20.2462C11.2929 20.1515 11.101 19.9212 10.7171 19.4605L10.2896 18.9475C10.1037 18.7244 10.0108 18.6129 9.90791 18.5195C9.61025 18.2492 9.23801 18.0748 8.83977 18.0192C8.70218 18 8.55699 18 8.26662 18C7.08889 18 6.50002 18 6.01542 17.8769C4.59398 17.5159 3.48406 16.406 3.12307 14.9846C3 14.5 3 13.9111 3 12.7334V10.5C3 7.21252 3 5.56878 3.90796 4.46243C4.07418 4.25989 4.25989 4.07418 4.46243 3.90796C5.56878 3 7.21252 3 10.5 3Z"
                                                                stroke="black" stroke-width="1.6" stroke-linecap="round" />
                                                        </svg>
                                                    </a>
                                                    <h5 className="text-gray-900 text-sm font-normal leading-snug">Replies</h5>
                                                </div>
                                                <div className="justify-start items-center gap-1.5 flex">
                                                    <a href="">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                            viewBox="0 0 24 24" fill="none">
                                                            <path
                                                                d="M16 14C16 15.6569 14 17 12 17C10 17 8 15.6569 8 14M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12ZM10 9C10 9.55228 9.55228 10 9 10C8.44772 10 8 9.55228 8 9C8 8.44772 8.44772 8 9 8C9.55228 8 10 8.44772 10 9ZM16 9C16 9.55228 15.5523 10 15 10C14.4477 10 14 9.55228 14 9C14 8.44772 14.4477 8 15 8C15.5523 8 16 8.44772 16 9Z"
                                                                stroke="#111827" stroke-width="1.6"
                                                                stroke-linecap="round" />
                                                        </svg>
                                                    </a>
                                                    <h5 className="text-gray-900 text-sm font-normal leading-snug">Reactions
                                                    </h5>
                                                </div>
                                            </div>
                                            <div className="justify-end items-center gap-1 flex">
                                                <h5 className="text-gray-500 text-sm font-normal leading-snug">4</h5>
                                                <div className="justify-start items-start flex -space-x-2 overflow-hidden">
                                                    <div
                                                        className="p-1.5 inline-block ring-1 ring-white bg-gray-100 rounded-full border border-white justify-center items-center flex">
                                                        <img className="w-3 h-3"
                                                            src="https://pagedone.io/asset/uploads/1716545141.png"
                                                            alt="Thumbs Up emoji" />
                                                    </div>
                                                    <div
                                                        className="p-1.5 inline-block ring-1 ring-white bg-gray-100 rounded-full border border-white justify-center items-center flex">
                                                        <img className="w-3 h-3"
                                                            src="https://pagedone.io/asset/uploads/1716545183.png"
                                                            alt="Smiling eyes emoji" />
                                                    </div>
                                                    <div
                                                        className="p-1.5 inline-block ring-1 ring-white bg-gray-100 rounded-full border border-white justify-center items-center flex">
                                                        <img className="w-3 h-3"
                                                            src="https://pagedone.io/asset/uploads/1716545217.png"
                                                            alt="hugging face emoji" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div
                                    className="w-full lg:pl-60 md:pl-20 sm:pl-10 pl-7 flex-col justify-start items-end gap-2.5 flex">
                                    <div
                                        className="w-full p-6 bg-gray-50 rounded-2xl border border-gray-200 flex-col justify-start items-start gap-8 flex">
                                        <div className="w-full flex-col justify-center items-start gap-3.5 flex">
                                            <div className="w-full justify-between items-center inline-flex">
                                                <div className="justify-start items-center gap-2.5 flex">
                                                    <div
                                                        className="w-10 h-10 bg-stone-300 rounded-full justify-start items-start gap-2.5 flex">
                                                        <img className="rounded-full object-cover" src="https://pagedone.io/asset/uploads/1716546816.png"
                                                            alt="James Anderson image" />
                                                    </div>
                                                    <div className="flex-col justify-start items-start gap-1 inline-flex">
                                                        <h5 className="text-gray-900 text-sm font-semibold leading-snug">James
                                                            Anderson</h5>
                                                        <h6 className="text-gray-500 text-xs font-normal leading-5">25 mins ago
                                                        </h6>
                                                    </div>
                                                </div>
                                                <div className="w-6 h-6 relative">
                                                    <div className="w-full h-fit flex">
                                                        <div className="relative w-full">
                                                            <div className=" absolute left-0 top-0 py-2.5 px-4 text-gray-300">
                                                            </div>
                                                            <button id="dropdown-button" data-target="dropdown-3"
                                                                className="w-full justify-center dropdown-toggle flex-shrink-0 z-10 flex items-center text-base font-medium text-center text-gray-900 bg-transparent  absolute right-0 top-0"
                                                                type="button">
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="24"
                                                                    height="24" viewBox="0 0 24 24" fill="none">
                                                                    <path
                                                                        d="M12.0161 16.9893V17.0393M12.0161 11.9756V12.0256M12.0161 6.96191V7.01191"
                                                                        stroke="black" stroke-width="2.5"
                                                                        stroke-linecap="round" />
                                                                </svg>
                                                            </button>
                                                            <div id="dropdown-3"
                                                                className="absolute top-10 right-0 z-20 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 open hidden">
                                                                <ul className="py-2 text-sm text-gray-700 dark:text-gray-200"
                                                                    aria-labelledby="dropdown-button">
                                                                    <li>
                                                                        <a href="#"
                                                                            className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Edit</a>
                                                                    </li>
                                                                    <li>
                                                                        <a href="#"
                                                                            className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Save</a>
                                                                    </li>
                                                                    <li>
                                                                        <a href="#"
                                                                            className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Delete</a>
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <p className="text-gray-800 text-sm font-normal leading-snug">I agree, and I also
                                                loved how the secondary characters evolved. Each one had their own unique
                                                arc that added depth to the overall narrative.</p>
                                        </div>
                                        <div className="w-full justify-between items-center inline-flex">
                                            <div className="justify-start items-center gap-4 flex">
                                                <div className="justify-start items-center gap-1.5 flex">
                                                    <a href="">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                            viewBox="0 0 24 24" fill="none">
                                                            <path
                                                                d="M7.04962 9.99504L7 10M12 10L11.9504 10.005M17 10L16.9504 10.005M10.5 3H13.5C16.7875 3 18.4312 3 19.5376 3.90796C19.7401 4.07418 19.9258 4.25989 20.092 4.46243C21 5.56878 21 7.21252 21 10.5V12.4777C21 13.8941 21 14.6023 20.8226 15.1779C20.4329 16.4427 19.4427 17.4329 18.1779 17.8226C17.6023 18 16.8941 18 15.4777 18C15.0811 18 14.8828 18 14.6985 18.0349C14.2966 18.1109 13.9277 18.3083 13.6415 18.6005C13.5103 18.7345 13.4003 18.8995 13.1803 19.2295L13.1116 19.3326C12.779 19.8316 12.6126 20.081 12.409 20.198C12.1334 20.3564 11.7988 20.3743 11.5079 20.2462C11.2929 20.1515 11.101 19.9212 10.7171 19.4605L10.2896 18.9475C10.1037 18.7244 10.0108 18.6129 9.90791 18.5195C9.61025 18.2492 9.23801 18.0748 8.83977 18.0192C8.70218 18 8.55699 18 8.26662 18C7.08889 18 6.50002 18 6.01542 17.8769C4.59398 17.5159 3.48406 16.406 3.12307 14.9846C3 14.5 3 13.9111 3 12.7334V10.5C3 7.21252 3 5.56878 3.90796 4.46243C4.07418 4.25989 4.25989 4.07418 4.46243 3.90796C5.56878 3 7.21252 3 10.5 3Z"
                                                                stroke="black" stroke-width="1.6" stroke-linecap="round" />
                                                        </svg>
                                                    </a>
                                                    <h5 className="text-gray-900 text-sm font-normal leading-snug">Replies</h5>
                                                </div>
                                                <div className="justify-start items-center gap-1.5 flex">
                                                    <a href="">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                            viewBox="0 0 24 24" fill="none">
                                                            <path
                                                                d="M16 14C16 15.6569 14 17 12 17C10 17 8 15.6569 8 14M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12ZM10 9C10 9.55228 9.55228 10 9 10C8.44772 10 8 9.55228 8 9C8 8.44772 8.44772 8 9 8C9.55228 8 10 8.44772 10 9ZM16 9C16 9.55228 15.5523 10 15 10C14.4477 10 14 9.55228 14 9C14 8.44772 14.4477 8 15 8C15.5523 8 16 8.44772 16 9Z"
                                                                stroke="#111827" stroke-width="1.6"
                                                                stroke-linecap="round" />
                                                        </svg>
                                                    </a>
                                                    <h5 className="text-gray-900 text-sm font-normal leading-snug">Reactions
                                                    </h5>
                                                </div>
                                            </div>
                                            <div className="justify-end items-center gap-1 flex">
                                                <h5 className="text-gray-500 text-sm font-normal leading-snug">2</h5>
                                                <div className="justify-start items-start flex -space-x-2 overflow-hidden">
                                                    <div
                                                        className="p-1.5 inline-block ring-1 ring-white bg-gray-100 rounded-full border border-white justify-center items-center flex">
                                                        <img className="w-3 h-3"
                                                            src="https://pagedone.io/asset/uploads/1716545141.png"
                                                            alt="Thumbs Up emoji" />
                                                    </div>
                                                    <div
                                                        className="p-1.5 inline-block ring-1 ring-white bg-gray-100 rounded-full border border-white justify-center items-center flex">
                                                        <img className="w-3 h-3"
                                                            src="https://pagedone.io/asset/uploads/1716545183.png"
                                                            alt="Smiling eyes emoji" />
                                                    </div>
                                                    <div
                                                        className="p-1.5 inline-block ring-1 ring-white bg-gray-100 rounded-full border border-white justify-center items-center flex">
                                                        <img className="w-3 h-3"
                                                            src="https://pagedone.io/asset/uploads/1716545217.png"
                                                            alt="hugging face emoji" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="w-full flex-col justify-start items-end gap-5 flex">
                                <div
                                    className="w-full p-6 bg-white rounded-2xl border border-gray-200 flex-col justify-start items-start gap-8 flex">
                                    <div className="w-full flex-col justify-center items-start gap-3.5 flex">
                                        <div className="w-full justify-between items-center inline-flex">
                                            <div className="justify-start items-center gap-2.5 flex">
                                                <div
                                                    className="w-10 h-10 bg-gray-200 rounded-full justify-start items-start gap-2.5 flex">
                                                    <img className="rounded-full object-cover" src="https://pagedone.io/asset/uploads/1710225621.png"
                                                        alt="Robert Wilson image" />
                                                </div>
                                                <div className="flex-col justify-start items-start gap-1 inline-flex">
                                                    <h5 className="text-gray-900 text-sm font-semibold leading-snug">Robert
                                                        Wilson</h5>
                                                    <h6 className="text-gray-500 text-xs font-normal leading-5">6 hr ago</h6>
                                                </div>
                                            </div>
                                            <div className="w-6 h-6 relative">
                                                <div className="w-full h-fit flex">
                                                    <div className="relative w-full">
                                                        <div className=" absolute left-0 top-0 py-2.5 px-4 text-gray-300"></div>
                                                        <button id="dropdown-button" data-target="dropdown-4"
                                                            className="w-full justify-center dropdown-toggle flex-shrink-0 z-10 flex items-center text-base font-medium text-center text-gray-900 bg-transparent  absolute right-0 top-0"
                                                            type="button">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                                viewBox="0 0 24 24" fill="none">
                                                                <path
                                                                    d="M12.0161 16.9893V17.0393M12.0161 11.9756V12.0256M12.0161 6.96191V7.01191"
                                                                    stroke="black" stroke-width="2.5"
                                                                    stroke-linecap="round" />
                                                            </svg>
                                                        </button>
                                                        <div id="dropdown-4"
                                                            className="absolute top-10 right-0 z-20 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 open hidden">
                                                            <ul className="py-2 text-sm text-gray-700 dark:text-gray-200"
                                                                aria-labelledby="dropdown-button">
                                                                <li>
                                                                    <a href="#"
                                                                        className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Edit</a>
                                                                </li>
                                                                <li>
                                                                    <a href="#"
                                                                        className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Save</a>
                                                                </li>
                                                                <li>
                                                                    <a href="#"
                                                                        className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Delete</a>
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-gray-800 text-sm font-normal leading-snug">The themes in this book
                                            really made me think about life and purpose. It's a very introspective read that
                                            encourages self-reflection and personal growth. The way the author weaves
                                            philosophical questions into the storyline is seamless and thought-provoking.
                                            Each chapter seemed to pose new questions about identity, morality, and the
                                            human condition. It’s one of those books that stays with you long after you’ve
                                            turned the last page, prompting you to reflect on your own beliefs and values.
                                            The narrative was both compelling and enlightening, providing a deep dive into
                                            the complexities of life.</p>
                                    </div>
                                    <div className="w-full justify-between items-center inline-flex">
                                        <div className="justify-start items-center gap-4 flex">
                                            <div className="justify-start items-center gap-1.5 flex">
                                                <a href="">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                        viewBox="0 0 24 24" fill="none">
                                                        <path
                                                            d="M7.04962 9.99504L7 10M12 10L11.9504 10.005M17 10L16.9504 10.005M10.5 3H13.5C16.7875 3 18.4312 3 19.5376 3.90796C19.7401 4.07418 19.9258 4.25989 20.092 4.46243C21 5.56878 21 7.21252 21 10.5V12.4777C21 13.8941 21 14.6023 20.8226 15.1779C20.4329 16.4427 19.4427 17.4329 18.1779 17.8226C17.6023 18 16.8941 18 15.4777 18C15.0811 18 14.8828 18 14.6985 18.0349C14.2966 18.1109 13.9277 18.3083 13.6415 18.6005C13.5103 18.7345 13.4003 18.8995 13.1803 19.2295L13.1116 19.3326C12.779 19.8316 12.6126 20.081 12.409 20.198C12.1334 20.3564 11.7988 20.3743 11.5079 20.2462C11.2929 20.1515 11.101 19.9212 10.7171 19.4605L10.2896 18.9475C10.1037 18.7244 10.0108 18.6129 9.90791 18.5195C9.61025 18.2492 9.23801 18.0748 8.83977 18.0192C8.70218 18 8.55699 18 8.26662 18C7.08889 18 6.50002 18 6.01542 17.8769C4.59398 17.5159 3.48406 16.406 3.12307 14.9846C3 14.5 3 13.9111 3 12.7334V10.5C3 7.21252 3 5.56878 3.90796 4.46243C4.07418 4.25989 4.25989 4.07418 4.46243 3.90796C5.56878 3 7.21252 3 10.5 3Z"
                                                            stroke="black" stroke-width="1.6" stroke-linecap="round" />
                                                    </svg>
                                                </a>
                                                <h5 className="text-gray-900 text-sm font-normal leading-snug">1 Replies</h5>
                                            </div>
                                            <div className="justify-start items-center gap-1.5 flex">
                                                <a href="">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                        viewBox="0 0 24 24" fill="none">
                                                        <path
                                                            d="M16 14C16 15.6569 14 17 12 17C10 17 8 15.6569 8 14M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12ZM10 9C10 9.55228 9.55228 10 9 10C8.44772 10 8 9.55228 8 9C8 8.44772 8.44772 8 9 8C9.55228 8 10 8.44772 10 9ZM16 9C16 9.55228 15.5523 10 15 10C14.4477 10 14 9.55228 14 9C14 8.44772 14.4477 8 15 8C15.5523 8 16 8.44772 16 9Z"
                                                            stroke="#111827" stroke-width="1.6" stroke-linecap="round" />
                                                    </svg>
                                                </a>
                                                <h5 className="text-gray-900 text-sm font-normal leading-snug">Reactions</h5>
                                            </div>
                                        </div>
                                        <div className="justify-end items-center gap-1 flex">
                                            <h5 className="text-gray-500 text-sm font-normal leading-snug">62</h5>
                                            <div className="justify-start items-start flex -space-x-2 overflow-hidden">
                                                <div
                                                    className="p-1.5 inline-block ring-1 ring-white bg-gray-100 rounded-full border border-white justify-center items-center flex">
                                                    <img className="w-3 h-3"
                                                        src="https://pagedone.io/asset/uploads/1716545141.png"
                                                        alt="Thumbs Up emoji" />
                                                </div>
                                                <div
                                                    className="p-1.5 inline-block ring-1 ring-white bg-gray-100 rounded-full border border-white justify-center items-center flex">
                                                    <img className="w-3 h-3"
                                                        src="https://pagedone.io/asset/uploads/1716545183.png"
                                                        alt="Smiling eyes emoji" />
                                                </div>
                                                <div
                                                    className="p-1.5 inline-block ring-1 ring-white bg-gray-100 rounded-full border border-white justify-center items-center flex">
                                                    <img className="w-3 h-3"
                                                        src="https://pagedone.io/asset/uploads/1716545217.png"
                                                        alt="hugging face emoji" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div
                                    className="w-full lg:pl-60 md:pl-20 sm:pl-10 pl-7 flex-col justify-start items-end gap-2.5 flex">
                                    <div
                                        className="w-full p-6 bg-gray-50 rounded-2xl border border-gray-200 flex-col justify-start items-start gap-8 flex">
                                        <div className="w-full flex-col justify-center items-start gap-3.5 flex">
                                            <div className="w-full justify-between items-center inline-flex">
                                                <div className="justify-start items-center gap-2.5 flex">
                                                    <div
                                                        className="w-10 h-10 bg-stone-300 rounded-full justify-start items-start gap-2.5 flex">
                                                        <img className="w-10 h-10 rounded-full object-cover"
                                                            src="https://pagedone.io/asset/uploads/1710238051.png"
                                                            alt="Sarah Davis image" />
                                                    </div>
                                                    <div className="flex-col justify-start items-start gap-1 inline-flex">
                                                        <h5 className="text-gray-900 text-sm font-semibold leading-snug">Sarah
                                                            Davis</h5>
                                                        <h6 className="text-gray-500 text-xs font-normal leading-5">2 hr ago
                                                        </h6>
                                                    </div>
                                                </div>
                                                <div className="w-6 h-6 relative">
                                                    <div className="w-full h-fit flex">
                                                        <div className="relative w-full">
                                                            <div className=" absolute left-0 top-0 py-2.5 px-4 text-gray-300">
                                                            </div>
                                                            <button id="dropdown-button" data-target="dropdown-5"
                                                                className="w-full justify-center dropdown-toggle flex-shrink-0 z-10 flex items-center text-base font-medium text-center text-gray-900 bg-transparent  absolute right-0 top-0"
                                                                type="button">
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="24"
                                                                    height="24" viewBox="0 0 24 24" fill="none">
                                                                    <path
                                                                        d="M12.0161 16.9893V17.0393M12.0161 11.9756V12.0256M12.0161 6.96191V7.01191"
                                                                        stroke="black" stroke-width="2.5"
                                                                        stroke-linecap="round" />
                                                                </svg>
                                                            </button>
                                                            <div id="dropdown-5"
                                                                className="absolute top-10 right-0 z-20 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 open hidden">
                                                                <ul className="py-2 text-sm text-gray-700 dark:text-gray-200"
                                                                    aria-labelledby="dropdown-button">
                                                                    <li>
                                                                        <a href="#"
                                                                            className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Edit</a>
                                                                    </li>
                                                                    <li>
                                                                        <a href="#"
                                                                            className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Save</a>
                                                                    </li>
                                                                    <li>
                                                                        <a href="#"
                                                                            className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Delete</a>
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <p className="text-gray-800 text-sm font-normal leading-snug">Same here. It's rare
                                                for a book to have such a lasting impact on my thoughts and perspectives.
                                                The narrative was both compelling and enlightening, truly a
                                                thought-provoking read. I found myself pondering the themes long after I’d
                                                finished the book, which is a testament to the author’s skill in crafting
                                                such a reflective and meaningful story. It’s the kind of book that sparks
                                                deep conversations and stays with you for a long time.</p>
                                        </div>
                                        <div className="w-full justify-between items-center inline-flex">
                                            <div className="justify-start items-center gap-4 flex">
                                                <div className="justify-start items-center gap-1.5 flex">
                                                    <a href="">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                            viewBox="0 0 24 24" fill="none">
                                                            <path
                                                                d="M7.04962 9.99504L7 10M12 10L11.9504 10.005M17 10L16.9504 10.005M10.5 3H13.5C16.7875 3 18.4312 3 19.5376 3.90796C19.7401 4.07418 19.9258 4.25989 20.092 4.46243C21 5.56878 21 7.21252 21 10.5V12.4777C21 13.8941 21 14.6023 20.8226 15.1779C20.4329 16.4427 19.4427 17.4329 18.1779 17.8226C17.6023 18 16.8941 18 15.4777 18C15.0811 18 14.8828 18 14.6985 18.0349C14.2966 18.1109 13.9277 18.3083 13.6415 18.6005C13.5103 18.7345 13.4003 18.8995 13.1803 19.2295L13.1116 19.3326C12.779 19.8316 12.6126 20.081 12.409 20.198C12.1334 20.3564 11.7988 20.3743 11.5079 20.2462C11.2929 20.1515 11.101 19.9212 10.7171 19.4605L10.2896 18.9475C10.1037 18.7244 10.0108 18.6129 9.90791 18.5195C9.61025 18.2492 9.23801 18.0748 8.83977 18.0192C8.70218 18 8.55699 18 8.26662 18C7.08889 18 6.50002 18 6.01542 17.8769C4.59398 17.5159 3.48406 16.406 3.12307 14.9846C3 14.5 3 13.9111 3 12.7334V10.5C3 7.21252 3 5.56878 3.90796 4.46243C4.07418 4.25989 4.25989 4.07418 4.46243 3.90796C5.56878 3 7.21252 3 10.5 3Z"
                                                                stroke="black" stroke-width="1.6" stroke-linecap="round" />
                                                        </svg>
                                                    </a>
                                                    <h5 className="text-gray-900 text-sm font-normal leading-snug">3 Replies
                                                    </h5>
                                                </div>
                                                <div className="justify-start items-center gap-1.5 flex">
                                                    <a href="">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                            viewBox="0 0 24 24" fill="none">
                                                            <path
                                                                d="M16 14C16 15.6569 14 17 12 17C10 17 8 15.6569 8 14M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12ZM10 9C10 9.55228 9.55228 10 9 10C8.44772 10 8 9.55228 8 9C8 8.44772 8.44772 8 9 8C9.55228 8 10 8.44772 10 9ZM16 9C16 9.55228 15.5523 10 15 10C14.4477 10 14 9.55228 14 9C14 8.44772 14.4477 8 15 8C15.5523 8 16 8.44772 16 9Z"
                                                                stroke="#111827" stroke-width="1.6"
                                                                stroke-linecap="round" />
                                                        </svg>
                                                    </a>
                                                    <h5 className="text-gray-900 text-sm font-normal leading-snug">Reactions
                                                    </h5>
                                                </div>
                                            </div>
                                            <div className="justify-end items-center gap-1 flex">
                                                <h5 className="text-gray-500 text-sm font-normal leading-snug">10</h5>
                                                <div className="justify-start items-start flex -space-x-2 overflow-hidden">
                                                    <div
                                                        className="p-1.5 inline-block ring-1 ring-white bg-gray-100 rounded-full border border-white justify-center items-center flex">
                                                        <img className="w-3 h-3"
                                                            src="https://pagedone.io/asset/uploads/1716545141.png"
                                                            alt="Thumbs Up emoji" />
                                                    </div>
                                                    <div
                                                        className="p-1.5 inline-block ring-1 ring-white bg-gray-100 rounded-full border border-white justify-center items-center flex">
                                                        <img className="w-3 h-3"
                                                            src="https://pagedone.io/asset/uploads/1716545183.png"
                                                            alt="Smiling eyes emoji" />
                                                    </div>
                                                    <div
                                                        className="p-1.5 inline-block ring-1 ring-white bg-gray-100 rounded-full border border-white justify-center items-center flex">
                                                        <img className="w-3 h-3"
                                                            src="https://pagedone.io/asset/uploads/1716545217.png"
                                                            alt="hugging face emoji" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

    );
};

export default CommentCard;
