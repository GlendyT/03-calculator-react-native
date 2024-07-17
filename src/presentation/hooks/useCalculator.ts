/* eslint-disable prettier/prettier */

import {useRef, useState} from 'react';

enum Operator {
  add,
  subtrack,
  multiply,
  divide,
}

export const useCalculator = () => {
  const [number, setNumber] = useState('0');
  const [prevNumber, setPrevNumber] = useState('0');

  const lastOperation = useRef<Operator>();

  const clean = () => {
    setNumber('0');
    setPrevNumber('0');
  };

  const deleteOperation = () => {
    let currentSign = '';
    let temporalNumber = number;

    if (number.includes('-')) {
      currentSign = '-';
      temporalNumber = number.substring(1); // remover o agregar el signo negativo
    }

    if (temporalNumber.length > 1) {
      return setNumber(currentSign + temporalNumber.slice(0, -1));
    }

    setNumber('0');
  };

  const toggleSign = () => {
    if (number.includes('-')) {
      return setNumber(number.replace('-', ''));
    }
    setNumber('-' + number);
  };

  const buildNumber = (numberString: string) => {
    if (number.includes('.') && numberString === '.') {
      return;
    }

    if (number.startsWith('0') || number.startsWith('-0')) {
      //Colocar Punto Decimal
      if (numberString === '.') {
        return setNumber(number + numberString);
      }
      //Evaluar si es otro cero y no hay punto
      if (numberString === '0' && number.includes('.')) {
        return setNumber(number + numberString);
      }

      //Evaluar si es diferente de cero, no hay punto, y es el primer numero
      if (numberString !== '0' && !number.includes('.')) {
        return setNumber(numberString);
      }

      //Evitar 000.00
      if (numberString === '0' && !number.includes('.')) {
        return;
      }

      return setNumber(number + numberString);
    }
    setNumber(number + numberString);
  };

  const setLastNumber = () => {
    if (number.endsWith('.')) {
      setPrevNumber(number.slice(0, -1));
    } else {
      setPrevNumber(number);
    }
    setNumber('0');
  };

  const divideOperation = () => {
    setLastNumber();
    lastOperation.current = Operator.divide;
  };

  const multiplyOperation = () => {
    setLastNumber();
    lastOperation.current = Operator.multiply;
  };

  const subtrackOperation = () => {
    setLastNumber();
    lastOperation.current = Operator.subtrack;
  };

  const addOperation = () => {
    setLastNumber();
    lastOperation.current = Operator.add;
  };

  const calculateResult = () => {
    const num1 = Number(number); //NaN
    const num2 = Number(prevNumber); //NaN

    switch (lastOperation.current) {
      case Operator.add:
        setNumber(`${num1 + num2}`);
        break;

      case Operator.subtrack:
        setNumber(`${num2 - num1}`);
        break;

      case Operator.multiply:
        setNumber(`${num1 * num2}`);
        break;

      case Operator.divide:
        setNumber(`${num2 / num1}`);
        break;

      default:
        throw new Error('Operation not implemented');
    }
    setPrevNumber('0');
  };

  return {
    //Properties
    number,
    prevNumber,
    //Methods
    buildNumber,
    clean,
    deleteOperation,
    toggleSign,
    divideOperation,
    multiplyOperation,
    subtrackOperation,
    addOperation,
    calculateResult,
  };
};
