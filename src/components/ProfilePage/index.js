import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect, useState } from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import { List } from 'react-content-loader';
import { useHistory } from 'react-router-dom';
import { blackArrow } from './profilePage.utils';
import { avatar } from '../SearchPage/searchPage.utils';
import './index.css';

export default function ProfilePage(props) {
  const history = useHistory();
  const [pinnedRepo, setpinnedRepo] = useState([]);

  const [apiLoading, setApiLoading] = useState(false);
  const [apiTwoLoading, setApiTwoLoading] = useState(false);
  const [userData, setuserData] = useState([]);
  const [pageHeight, setPageHeight] = useState(
    window.innerHeight - window.innerHeight / 10
  );
  window.onresize = () => {
    setPageHeight(window.innerHeight - window.innerHeight / 10);
  };
  useEffect(() => {
    if (props.location.loginId) {
      setApiLoading(true);
      setApiTwoLoading(true);
      axios
        .get(`https://api.github.com/users/${props.location.loginId}`)
        .then((res) => {
          const response = res.data;
          setuserData(response);
          setApiLoading(false);
        })
        .catch((error) => {
          toast.error(error.response.data.message);
          setApiLoading(false);
        });
      axios
        .get(
          `https://gh-pinned-repos-5l2i19um3.vercel.app/?username=${props.location.loginId}`
        )
        .then((res) => {
          const response = res.data;
          setpinnedRepo(response);
          setApiTwoLoading(false);
        })
        .catch((error) => {
          toast.error(error.response.data.message);
          setApiTwoLoading(false);
        });
    } else {
      history.push('/');
    }
  }, []);
  return (
    <Card className='m-4 shadow ' style={{ height: pageHeight }}>
      <Card.Header className='border-bottom py-3 px-5'>
        <div className='fw-bold d-flex mb-5'>
          <span
            onClick={() =>
              history.push({
                pathname: '/',
                data: props.location.data,
                searchData: props.location.searchData,
              })
            }
            style={{ cursor: 'pointer' }}
          >
            {blackArrow}
            <span className='mx-1'>Back</span>
          </span>
        </div>
        <div className='d-flex mb-5'>
          <img
            width='100px'
            className='border border-2 rounded'
            src={props.location.avatar_url}
            alt='profile'
          />
          <div className='d-flex flex-column p-2 m-2 '>
            <span className='fw-bold text-secondary'>{userData.name}</span>
            <span className='fs-6 text-black-50'>{`@${props.location.loginId}`}</span>
          </div>
        </div>
      </Card.Header>
      <Card.Body
        style={{ height: pageHeight }}
        className='py-3 px-5 overflow-auto'
      >
        <div>
          <span className='fs-5 text-secondary'>Bio</span>
          <p className='fs-6 text-black-50'>
            {userData.bio ? userData.bio : 'Bio not provided'}
          </p>
        </div>
        <div>
          <span className='fs-5 text-secondary'>Works at</span>
          <p className='fs-6 text-black-50'>
            {userData.company ? userData.company : 'No Company data'}
          </p>
        </div>
        <div className='heading-profile'>
          <div className='child-heading'>
            <span className='fs-5 text-secondary '>Repositories</span>
            <p className='fs-6 text-black-50'>
              {userData.public_repos ? userData.public_repos : 'No data'}
            </p>
          </div>
          <div className='child-heading'>
            <span className='fs-5 text-secondary'>Followers</span>
            <p className='fs-6 text-black-50'>
              {userData.followers ? userData.followers : 'No data'}
            </p>
          </div>
        </div>
        <div>
          <span className='fs-5 text-secondary'>Pinned Repositories</span>

          <Row>{getPinnedRepoCards(pinnedRepo, apiTwoLoading)}</Row>
          {apiLoading && apiTwoLoading ? <List /> : null}
        </div>
      </Card.Body>
      <ToastContainer />
    </Card>
  );
}
const getPinnedRepoCards = (pinnedRepo, apiloading) => {
  if (pinnedRepo.length === 0 && !apiloading) {
    return (
      <div className='w-100 h-100 d-flex'>
        <span className='fs-3 fw-normal text-black-50'>
          User has no pinned repos
        </span>
      </div>
    );
  }
  return pinnedRepo.map((item, index) => (
    <Col lg={6} sm={12} md={12} xs={12}>
      <Card
        className='shadow-sm rounded mb-4 '
        key={index}
        style={{ minHeight: '120px' }}
      >
        <Card.Body className='d-flex'>
          <div
            className='rounded-circle bg-primary p-1 text-white mx-2 '
            style={{ height: '40px' }}
          >
            {avatar}
          </div>
          <div className='overflow-auto d-flex flex-column'>
            <span className='fw-bold'>
              {item.repo
                ? item.repo
                : item.owner
                ? item.owner
                : 'No owner/repo data'}
            </span>
            <span
              classname='text-black-50'
              style={{ fontSize: '12px', color: 'GrayText' }}
            >
              {item.description ? item.description : 'No description'}
            </span>
          </div>
        </Card.Body>
      </Card>
    </Col>
  ));
};
