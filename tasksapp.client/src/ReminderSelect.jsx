"use client";

import React, { useState } from "react";
import {Text,Box} from "@chakra-ui/react";
import { useColorModeValue } from "@chakra-ui/react";
const ReminderSelect = ({ onChange, value }) => {
  const [selectedValues, setSelectedValues] = useState(value || []);
   const textColor = useColorModeValue('black', 'black'); // Черный в светлой, белый в темной
  const handleOptionClick = (optionValue) => {
    console.log(optionValue);
    setSelectedValues((prevValues) => {
      if (prevValues.includes(optionValue)) {
        return prevValues.filter((v) => v !== optionValue);
      } else {
        return [...prevValues, optionValue];
      }
    });
  };

  React.useEffect(() => {
    onChange(selectedValues); // Call onChange when selectedValues change
  }, [selectedValues, onChange]);

  const reminderOptions = [
    { label: "В момент начала", value: 0 },
    { label: "За 5 минут", value: 5 },
    { label: "За 10 минут", value: 10 },
    { label: "За 15 минут", value: 15 },
    { label: "За 30 минут", value: 30 },
    { label: "За 1 час", value: 60 },
    { label: "За 5 часов", value: 300 },
    { label: "За 1 сутки", value: 1440 },
    { label: "За 3 суток", value: 4320 },
    { label: "За неделю", value: 10080 },
    { label: "За месяц", value: 43200 },
  ];

  
  return (
    <div>
        {reminderOptions.map((option) => (
          <button
          fontSize={21}
            key={option.value}
            type="button"
            onClick={() => handleOptionClick(option.value)}
            style={{
              padding: "0px 10px",
              minWidth: "120px",
              margin: "3px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              fontSize: '18px',
              color: textColor,
              backgroundColor: selectedValues.includes(option.value)
                ? "#e0e0e0"
                : "white",
              fontWeight: selectedValues.includes(option.value)
                ? "bold"
                : "normal",
              cursor: "pointer",
            }}
          >
            {option.label}
          </button>
        ))}
       <div>
        {selectedValues.length > 0 ? (
          <label>
            <Text fontSize={21}>
              Выбрано: {selectedValues.map(v => reminderOptions.find(o => o.value === v).label).join(", ")} {/*  Чтобы отображать label, а не value */}
            </Text>
          </label>
        ) : (
          <label>
             <Text fontSize={21}>Ничего не выбрано</Text>
             </label>
        )}
      </div>
    </div>
  );
};

export default ReminderSelect;