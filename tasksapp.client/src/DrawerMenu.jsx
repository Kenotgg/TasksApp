import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  RadioGroup,
  Stack,
  Radio,
  Button,
  IconButton,
  Text,
  Box
} from '@chakra-ui/react';
import { ArrowForwardIcon, HamburgerIcon, SunIcon, SearchIcon,SettingsIcon,CalendarIcon,BellIcon,DeleteIcon,MoonIcon} from '@chakra-ui/icons';
export default function DrawerMenu({isOpen, onClose, placement= 'left'}) {
  return (
    <>
      <Drawer placement={placement} onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth='1px'>Меню</DrawerHeader>
          <DrawerBody>
            <Stack  direction={"column"}>
              <Button>
                <SettingsIcon></SettingsIcon>
                <Text>Настройки</Text>
              </Button>
               <Button>
                <BellIcon></BellIcon>
                <Text>Напоминания</Text>
              </Button>
               <Button>
                <SearchIcon></SearchIcon>
                <Text>Поиск</Text>
              </Button>

            </Stack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  )
}