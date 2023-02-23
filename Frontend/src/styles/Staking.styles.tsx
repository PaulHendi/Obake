import styled from "styled-components";


export const StakingContainer = styled.div`

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-top: 2%;
    margin-bottom: 10%;
    margin-left: 30%;
    margin-right: 30%;
    background-color: #F5F5F5;
    border-radius: 10px;
    padding: 5px;
    font-family: Arial, Helvetica, sans-serif;
    font-size: large;
    text-align: center;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5);
    
    h1 {
    font-size: 24px;
    margin-top: 0;
    }
    p {
        font-size: 16px;
        line-height: 1.5;
        margin-bottom: 20px;
    }
    
`

export const Input = styled.input`
    border-radius:24px;
    height: 100%;
    text-align: center;
    padding: 0 0 0 0;
    margin: 0 0 0 0;
    border: 0;
    -moz-appearance: textfield;
    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }

`

export const InputRow = styled.div`
display: flex;
margin: 0 auto;
color: dark gray;
align-items: center;
border: gray 1px solid;
border-radius: 24px;
overflow: hidden;
`


export const SmallButton = styled.button`
  display: flex;
  justify-content: center;
  min-width: 95px;
  height: unset;
  padding: 8px 24px;
  border-radius: 24px;
  &:disabled {
    color: dark gray;
    cursor: unset;
  }
  &:disabled:hover,
  &:disabled:focus {
    background-color: unset;
    color: unset;
  }
`