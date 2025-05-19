// ColorModeSwitcher.jsx (или в любом другом файле)
import { IconButton, useColorMode, useColorModeValue } from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";

function ColorModeSwitcher() {
    const { toggleColorMode } = useColorMode();
    const text = useColorModeValue("Включить темный режим", "Включить светлый режим");
    const SwitchIcon = useColorModeValue(MoonIcon, SunIcon);
    const buttonColor = useColorModeValue("gray.100", "#1a202c"); // Белый в светлой теме, серый в темной
    return (
        <IconButton
            size="md"
            fontSize="lg"
            aria-label={text}
            variant="ghost"
            background={buttonColor}
            color={"current"}
            marginLeft="2"
            onClick={toggleColorMode}
            icon={<SwitchIcon />}
        />
    );
}

export default ColorModeSwitcher;