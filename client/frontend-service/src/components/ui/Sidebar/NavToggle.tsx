"use client"

import { MdKeyboardArrowLeft, MdOutlineKeyboardArrowRight } from "react-icons/md";
import { IconButton, Stack } from "rsuite";

type NavToggleProps = {
  expand: boolean;
  onChange: () => void;
};

export const NavToggle = ({ expand, onChange }: NavToggleProps) => {
  return (
	<Stack className="nav-toggle" justifyContent={expand ? 'flex-end' : 'center'}>
	  <IconButton
		onClick={onChange}
		appearance="subtle"
		size="lg"
		icon={expand ? <MdKeyboardArrowLeft /> : <MdOutlineKeyboardArrowRight />}
	  />
	</Stack>
  );
};