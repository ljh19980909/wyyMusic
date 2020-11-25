import React, { Component } from 'react';
import { BrowserRouter, NavLink, Route } from 'react-router-dom';
import Swiper from 'swiper';
import '../../../../../node_modules/swiper/dist/css/swiper.css';
import './Recommend.css';
import { CustomerServiceOutlined } from '@ant-design/icons';
import Network from '../../../Fetch/network';
import Store from '../../../ReactRedux/Store/Store';
import { add } from '../../../ReactRedux/Actions/Actions';

export default class Recommend extends Component {
    constructor(props) {
        super(props);
        this.state = {
            banners: [],
            personalized: [],
        };
        console.log(props);
    }
    render() {
        return (
            <div className="sc-eHgmQL kBTMZG">
                <div className="sc-EHOje jiwVax">
                    {/* 轮播图 */}
                    <div className="sc-kEYyzF cxfKDL">
                        <div className="before"></div>
                        <div className="swiper-container">
                            <div className="swiper-wrapper">
                                {this.state.banners.map((v, i) => {
                                    return (
                                        <div className="swiper-slide" key={i}>
                                            <div className="slider-nav">
                                                <img
                                                    src={v.imageUrl}
                                                    width="100%"
                                                    height="100%"
                                                    alt={v.typeTitle}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="swiper-pagination"></div>
                        </div>
                    </div>
                    {/* 歌单展示 */}
                    <div className="sc-kkGfuU fyuXNY">
                        <h1 className="title">推荐歌单</h1>
                        <div className="sc-iAyFgw fAWnme">
                            {this.state.personalized.map((v, i) => {
                                return (
                                    <div
                                        className="sc-hSdWYo jCNzKX"
                                        key={i}
                                        onClick={() => this.songfests(v.id)}
                                    >
                                        <div className="img_wrapper">
                                            <div className="decorate"></div>
                                            <img
                                                width="100%"
                                                height="100%"
                                                src={v.picUrl}
                                                alt="music"
                                            />
                                            <div className="play_count">
                                                <i className="iconfont play">
                                                    <CustomerServiceOutlined />
                                                </i>
                                                <span className="count">
                                                    {Math.ceil(v.playCount / 10000)}万
                                                </span>
                                            </div>
                                        </div>
                                        <div className="desc">{v.name}</div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    componentDidMount() {
        //轮播图数据
        Network.get('/banner')
            .then(data => {
                this.setState(
                    {
                        banners: data.banners,
                    },
                    () => {
                        this.initSwiper();
                    }
                );
            })
            .catch(error => {
                console.log(error);
            });
        // 歌单数据
        Network.get('/personalized')
            .then(data => {
                this.setState({
                    personalized: data.result,
                });
            })
            .catch(error => {
                console.log(error);
            });
    }
    initSwiper() {
        this.swiper = new Swiper('.swiper-container', {
            loop: true,
            pagination: '.swiper-pagination',
            paginationClickable: true,
            autoplay: 2000,
            autoplayDisableOnInteraction: false, //触碰图片后时候轮播
        });
    }
    songfests(id) {
        this.props.history.push({ pathname: '/SongList', state: { id } });
        Store.dispatch(add(id));
    }
}
