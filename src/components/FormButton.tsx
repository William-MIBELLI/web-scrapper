"use client";

import { Button } from "@nextui-org/react";
import React, { FC } from "react";
import { useFormStatus } from "react-dom";

interface IProps {
  value: string;
}
const FormButton: FC<IProps> = ({ value }) => {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      className="dialog-btn w-full"
      isLoading={pending}
      isDisabled={
        value.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g) ? false : true
      }
    >
      Track
    </Button>
  );
};

export default FormButton;
