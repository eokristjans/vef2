import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';

import Button from '../button/Button';

import './Paging.scss';

interface IPagingProps {
  page?: number;
  prev?: boolean;
  next?: boolean;
  onClick?: (page: number, dir: string) => void;
}

export default function Paging(props: IPagingProps) {
  const { page = 1, prev = false, next = false, onClick = () => {} } = props;

  const handleOnClick = (dir: string) => () => {
    onClick(page, dir);
  }

  if (!prev && !next) {
    return null;
  }

  return (
    <div className="paging">
      {prev && (
        <div className="paging__prev">
          <Button small onClick={handleOnClick('prev')}>Previous page</Button>
        </div>
      )}
      <span className="paging__page">Page {page}</span>
      {next && (
        <div className="paging__next">
          <Button small onClick={handleOnClick('next')}>Next Page</Button>
        </div>
      )}
    </div>
  )
}