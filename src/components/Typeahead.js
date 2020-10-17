import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import data, { categories } from "../data";

const Wrapper = styled.div`
  min-height: 100vh;
  min-width: 100%;
`;

const Form = styled.form`
  margin: 0 auto;
  padding-top: 300px;
  width: 504px;
`;

const TextInput = styled.input`
  padding: 7px 30px;
  font-size: 24px;
  border: 1px solid #aaa;
  border-radius: 7px;
  &:focus {
    outline-color: #2b00d7;
  }
`;

const ResetInput = styled.input`
  font-size: 24px;
  padding: 8px 20px;
  margin-left: 10px;
  border: none;
  background: #2b00d7;
  color: #fff;
  border-radius: 7px;
`;
const SuggestionList = styled.ul`
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.1), 1px 0 15px rgba(0, 0, 0, 0.1);
  border-radius: 7px;
  padding: 5px 0;
  margin-top: 10px;
  max-height: 500px;
  overflow: auto;
  line-height: 20px;
`;

const SuggestionListContainer = ({ inputValue, children }) => {
  if (inputValue.length > 2) {
    return <SuggestionList>{children}</SuggestionList>;
  } else {
    return null;
  }
};

const SuggestionItem = styled.li`
  margin: 10px;
  padding: 10px;
  font-size: 18px;
  border-radius: 7px;
  cursor: pointer;
  &:active {
    background: blue;
  }
`;

const AutoCompleteText = styled.span`
  font-weight: bold;
`;

const SmallText = styled.span`
  font-size: 14px;
  font-style: italic;
`;

const CategoryText = ({ categoryId }) => {
  return (
    <>
      {Object.values(categories)
        .filter((category) => {
          if (category.id == categoryId) {
            return true;
          }
        })
        .map((category) => {
          return (
            <SmallText>
              {" "}
              in <PurpleText>{category.name}</PurpleText>
            </SmallText>
          );
        })}
    </>
  );
};

const PurpleText = styled.div`
  color: #aa5aa1;
`;

//COMPONENT
const Typeahead = ({ suggestions, handleSelect }) => {
  const [inputValue, setInputValue] = useState("");
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(0);
  const [enabled, setEnabled] = useState(true);
  const updateInputStateHandler = (ev) => {
    setInputValue(ev.target.value);
  };

  const resetHandler = () => {
    setInputValue("");
  };
  let maxIndex;
  const submitHandler = (ev) => {
    if (ev.key === "Enter") {
      handleSelect(ev.target.value);
    } else if (ev.key === "ArrowUp") {
      if (selectedSuggestionIndex > 0 && ev.target.value.length > 0) {
        setSelectedSuggestionIndex(selectedSuggestionIndex - 1);
        ev.preventDefault();
      }
    } else if (ev.key === "ArrowDown") {
      if (
        selectedSuggestionIndex >= 0 &&
        ev.target.value.length &&
        selectedSuggestionIndex < maxIndex - 1
      ) {
        setSelectedSuggestionIndex(selectedSuggestionIndex + 1);
        ev.preventDefault();
      }
    } else if (ev.key === "Escape") {
      setEnabled(!enabled);
    }
  };
  return (
    <Wrapper>
      <Form>
        <TextInput
          type="text"
          value={inputValue}
          onChange={updateInputStateHandler}
          onKeyDown={submitHandler}
        />
        <ResetInput type="reset" value="Clear" onClick={resetHandler} />
        {enabled && (
          <SuggestionListContainer inputValue={inputValue}>
            {suggestions
              .filter((book) => {
                maxIndex = 0;
                if (
                  book.title.toUpperCase().indexOf(inputValue.toUpperCase()) !==
                  -1
                ) {
                  return true;
                }
              })
              .map((book, index) => {
                const isSelected = index === selectedSuggestionIndex;

                maxIndex += 1;

                return (
                  <SuggestionItem
                    key={book.id}
                    tabIndex={0}
                    isSelected={isSelected}
                    style={{
                      background: isSelected ? "#fffbe6" : "transparent",
                    }}
                    onClick={() => handleSelect(book.title)}
                    onMouseOver={() => setSelectedSuggestionIndex(index)}
                    onFocus={() => {
                      setSelectedSuggestionIndex(index);
                      console.log(book.title);
                    }}
                  >
                    <span>
                      {book.title.substr(0, inputValue.length)}
                      <AutoCompleteText>
                        {book.title.slice(inputValue.length)}
                      </AutoCompleteText>
                    </span>

                    <CategoryText categoryId={book.categoryId} />
                  </SuggestionItem>
                );
              })}
          </SuggestionListContainer>
        )}
      </Form>
    </Wrapper>
  );
};

export default Typeahead;
