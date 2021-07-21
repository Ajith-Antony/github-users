import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState } from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import { List } from 'react-content-loader';
import { avatar, closeIcon, gitLogo, searchIcon } from './searchPage.utils';

export default function SearchPage() {
  const [usersearch, setuserSearch] = useState([]);
  const [pagenumber, setPagenumber] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [apiLoading, setApiLoading] = useState(false);
  const [pageHeight, setPageHeight] = useState(
    window.innerHeight - window.innerHeight / 10
  );

  window.onresize = () => {
    setPageHeight(window.innerHeight - window.innerHeight / 10);
  };
  const apiForUsers = (pagenumber) => {
    setApiLoading(true);
    if (searchInput) {
      axios
        .get(
          `https://api.github.com/search/users?q=${searchInput}&page=${pagenumber}&per_page=20`
        )
        .then((res) => {
          const persons = res.data.items;
          pagenumber === 1
            ? setuserSearch(persons)
            : setuserSearch([...usersearch, ...persons]);
          setApiLoading(false);
        })
        .catch((error) => {
          toast.error(error.response.data.message);
          setApiLoading(false);
        });
    }
  };
  const onScrollHandle = (evt) => {
    if (
      evt.target.offsetHeight + evt.target.scrollTop >=
      evt.target.scrollHeight
    ) {
      setPagenumber(pagenumber + 1);
      apiForUsers(pagenumber);
    }
  };
  return (
    <Card className='m-4 shadow ' style={{ height: pageHeight }}>
      <Card.Header className='border-bottom py-4'>
        <div className='d-flex m-2 p-4'>
          {gitLogo}
          <span className='d-flex fs-3 fw-normal text-black-50 ms-2 align-self-center col-8'>
            GitHub Profile Viewer
          </span>
        </div>
        <div className='m-4 p-1 bg-primary bg-gradient d-flex w-75 shadow-lg col-8'>
          <span
            style={{ cursor: 'pointer' }}
            onClick={() => apiForUsers(1)}
            className='d-flex justify-center align-self-center text-light px-4 '
          >
            {searchIcon}
          </span>
          <input
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.code === 'Enter') apiForUsers(1);
            }}
            type='text'
            value={searchInput}
            className='bg-primary bg-gradient text-white border-0 form-control shadow-none'
          />
          <span
            onClick={() => {
              setSearchInput('');
              setuserSearch([]);
            }}
            className='d-flex justify-center align-self-center text-light px-4 '
            style={{ cursor: 'pointer' }}
          >
            {closeIcon}
          </span>
        </div>
      </Card.Header>
      <Card.Body
        onScroll={(e) => {
          onScrollHandle(e);
        }}
        className='overflow-auto'
        style={{ height: pageHeight }}
      >
        <Row>{getCards(usersearch)}</Row>
        {apiLoading ? <List /> : null}
      </Card.Body>
      <ToastContainer />
    </Card>
  );
}
const getCards = (userSearch) => {
  return userSearch.map((item, index) => (
    <Col lg={3} sm={6} md={4} xs={12}>
      <Card className='shadow-sm rounded mb-4' key={index}>
        <Card.Body className='d-flex'>
          {item.avatar_url ? (
            <img
              width='40px'
              height='40px'
              className='rounded-circle me-2 '
              src={item.avatar_url}
              alt='profile avatar'
            />
          ) : (
            <div className='rounded-circle bg-primary p-1 text-white mx-2'>
              {avatar}
            </div>
          )}

          <div className='overflow-auto d-flex flex-column'>
            <span className='fw-bold'>{item.login}</span>
            <span
              classname='text-black-50'
              style={{ fontSize: '12px', color: 'GrayText' }}
            >{`@${item.login}`}</span>
          </div>
        </Card.Body>
      </Card>
    </Col>
  ));
};
