
"use client";

import { modalSubmit } from "@/lib/actions";
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
import { useState, FC } from "react";
import { useFormState } from "react-dom";
import FormButton from "./FormButton";

interface IProps {
  productId: string
}

export interface IModalState {
  error?: string
  success?:boolean
}

const ModalComp: FC<IProps> = ({ productId }) => {
  
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [value, setValue] = useState('')
  
  const [state, action] = useFormState(modalSubmit, { error: '' })
  
  if (state?.success) {
    console.log('if success')
    //onClose()
  }

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
              {
                !state?.success ? (
                  <form action={action}>
                    <input type="hidden" value={productId} name="productId"/>
                    <ModalBody>
                      <p className="text-sm mb-4">Never miss a bargain again with our timely alerts!</p>
                      <Input
                        className="font-semibold "
                        type="email"
                        label="Email"
                        name="email"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        labelPlacement="outside"
                        placeholder="Enter your email."
                        errorMessage={state?.error}
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
                      {/* <Button  type="submit" isDisabled={value.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g) ? false : true} className="w-full text-white bg-[#000]">
                        Track Product
                      </Button> */}
                      <FormButton value={value} />
                    </ModalFooter>
                  </form>
                  
                ) : (
                    <>
                      <ModalBody>
                        <p className="text-sm">Wonderfull! You will be notified when this product update.</p>
                      </ModalBody>
                      <ModalFooter>
                        <Button  color="success" className="text-white font-semibold w-full"  onPress={onClose}>Close</Button>
                      </ModalFooter>
                    </>
                    
                )
              }
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default ModalComp;

//