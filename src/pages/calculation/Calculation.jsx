{
  amount?.expensedList?.map(item => (
    <div
      key={item.deId}
      className="flex justify-between bg-white px-8 py-5 rounded-3xl mt-5"
    >
      <div
        className="w-full cursor-pointer"
        onClick={() => {
          console.log("여기 클릭", item.deId);
          setDeId(item.deId);
          setBillIsOpen(true);
        }}
      >
        <p className="text-lg text-slate-500">{item.paidFor || "항목 없음"}</p>
        <p className="mt-1 text-3xl text-slate-700 font-semibold">
          {(item.totalPrice || 0).toLocaleString()}원
        </p>
        <div className="flex items-center gap-3 mt-5">
          {/* ... 나머지 내용 ... */}
        </div>
      </div>

      <Menu as="div" className="relative inline-block text-left">
        <div>
          <MenuButton>
            <IoMdMore aria-hidden="true" className="size-9 text-slate-400" />
          </MenuButton>
        </div>

        <MenuItems
          transition
          className="absolute right-0 z-10 py-2 px-5 origin-top-right rounded-md bg-white ring-1 shadow-lg ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
          onClick={e => {
            e.stopPropagation();
            deleteExpenses(item.deId);
          }}
        >
          <div>
            <MenuItem>
              <p className="w-14 flex items-center gap-2 text-base text-error data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden z-[99]">
                <FaTrashAlt />
                삭제
              </p>
            </MenuItem>
          </div>
        </MenuItems>
      </Menu>
    </div>
  ));
}
