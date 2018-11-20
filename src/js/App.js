import React, { Component } from 'react';
import '../css/App.css';
import List from './List';
import $ from "jquery";

const API_KEY = 'AIzaSyD-G5LIZY-6xKQNBVRX5yuITVkIYrumBeU';

class App extends Component {
    state = {
        keyword: null,
        nextPageToken: null,
        videos: [],
        scroll: false
    }

    constructor(props) {
        super(props);
        this.search = this.search.bind(this);

        // 스크롤 끝 감지해서 무한 스크롤
        window.onscroll = () => {
            // 스크롤 끝 감지
            if($(window).scrollTop() + $(window).innerHeight() - document.body.scrollHeight >= -5.0) {
                this.setState({
                    scroll: true
                });
                this.fetchData();
            }
        }
    }

    // 검색 동작
    search(e) {
        e.preventDefault();
        this.setState({
            keyword: this.query.value,
            videos: []
        }, () => {
            this.fetchData();
        });
    }

    // API로부터 데이터 가져옴
    fetchData() {
        var that = this;
        // API와 query 반영. 기본 반영 개수는 5개인데 5개가 적절하다고 판단하여 건드리지 않음
        // 무한 스크롤 중일 경우 다음 페이지의 내용도 가져옴
        var url = "https://www.googleapis.com/youtube/v3/search?key=" + API_KEY +
                "&part=snippet,id&q=" + that.state.keyword;
        url += (that.state.scroll && that.state.nextPageToken != null) ? ("&pageToken=" + that.state.nextPageToken) : "";
        fetch(url)
        .then(function(response) {
            if(response.status >= 400) {
                throw new Error("Bad response from server");
            }
            return response.json();
        })
        .then(function(data) {
            var currVideos = that.state.videos.concat(data.items);
            that.setState({
                nextPageToken: data.nextPageToken,
                videos: currVideos,
                scroll: false
            });
        })
        .catch(error => {
            console.error(error);
        });
    }

    render() {
        const { loading, videos } = this.state;

        return (
            <html lang="ko">
            <head>
                <title>Search YouTube Videos Service</title>
            </head>
            <body>
                <span id="top"></span>
                <div id="container">
                <header>
                    <h1>Search <span>Videos</span></h1>
                    <p>Search all YouTube Videos</p>
                </header>
                <section>
                    <form id="search-form" method="get" onSubmit={this.search}>
                        <div className="fieldcontainer">
                            <input type="text" id="query" name="query" className="search-field" placeholder="Search YouTube" ref={(query) => this.query = query}/>
                            <input type="submit" name="search-btn" className="search-btn" value="      "/>
                        </div>
                    </form>
                    <ul id='results' className='item-list'>
                        <List videos={ videos }/>
                    </ul>
                </section>
                </div>
                <a href="#top" id="back-to-top-link">
                    <div id="back-to-top"></div>
                </a>
            </body>
            </html>
        );
    }
}

export default App;
