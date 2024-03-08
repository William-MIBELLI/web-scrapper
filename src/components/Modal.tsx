
"use client";

import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
} from "@nextui-org/react";
import Image from "next/image";

const ModalComp = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();


  return (
    <>
      <button type="button" className="btn" onClick={onOpen}>
        Track
      </button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} className="my-auto">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 pt-8">
                <Image
                  src='/assets/icons/logo.svg'
                  alt="logo"
                  width={20}
                  height={20}
                />
                <h4 className="font-bold">Stay updated with product pricing alerts right in your inbox!</h4>
              </ModalHeader>
              <ModalBody>
                <p className="text-sm mb-4">Never miss a bargain again with our timely alerts!</p>
                <Input
                  className="font-semibold "
                  type="email"
                  label="Email"
                  labelPlacement="outside"
                  placeholder="Enter your email."
                  startContent={
                    <Image
                      src="/assets/icons/mail.svg"
                      alt="mail"
                      width={20}
                      height={20}
                      
                    />
                  }
                />
              </ModalBody>
              <ModalFooter className="flex justify-center">
                <Button className="w-full text-white bg-[#000]" onPress={onClose}>
                  Track Product
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default ModalComp;
