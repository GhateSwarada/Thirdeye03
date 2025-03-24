import React from 'react';
import { Triangle } from 'react-loader-spinner';
import style from '../CSS/Loader.module.css';

const Loader = () => {
  return (
    <div className={style.loader}>
        <div className={style.spinner}>
            <Triangle color="#00BFFF" height={120} width={120} />
        </div>
    </div>
  );
};

export default Loader;