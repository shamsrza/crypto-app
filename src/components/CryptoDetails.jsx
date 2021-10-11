import React, { useState } from 'react';
import Parser from 'html-react-parser';
import { useParams } from 'react-router-dom';
import millify from 'millify';
import { Col, Row, Typography, Select } from 'antd';
import { MoneyCollectOutlined, DollarCircleOutlined, FundOutlined, ExclamationCircleOutlined, StopOutlined, TrophyOutlined, CheckOutlined, NumberOutlined, ThunderboltOutlined } from '@ant-design/icons';

import { useGetCryptoDetailsQuery, useGetCryptoHistoryQuery } from '../services/cryptoApi';
import Loader from './Loader';
import LineChart from './LineChart';

const { Title, Text } = Typography;
const { Option } = Select;


const CryptoDetails = () => {
    const { coinId } = useParams();
    const [timePeriod, setTimePeriod] = useState('7d');
    const { data: cryptoDetails, isFetching } = useGetCryptoDetailsQuery(coinId);
    const { data: coinHistory } = useGetCryptoHistoryQuery({ coinId, timePeriod });
    //const cryptoDetails = data?.data?.coin
    ///console.log(data);

    

    
  
    if (isFetching) return <Loader />;
  
    const time = ['3h', '24h', '7d', '30d', '1y', '3m', '3y', '5y'];
  
    const stats = [
      { title: 'Price to USD', value: `$ ${cryptoDetails?.data?.coin.price}`, icon: <DollarCircleOutlined /> },
      { title: 'Rank', value: cryptoDetails?.data?.coin.rank, icon: <NumberOutlined /> },
      { title: '24h Volume', value: ` $ ${cryptoDetails?.data?.coin.volume} `, icon: <ThunderboltOutlined /> },
      { title: 'Market Cap', value: `$ ${cryptoDetails?.data?.coin.marketCap}`, icon: <DollarCircleOutlined /> },
      { title: 'All-time-high(daily avg.)', value: `$ ${cryptoDetails?.data?.coin.allTimeHigh.price}`, icon: <TrophyOutlined /> },
    ];
  
    const genericStats = [
      { title: 'Number Of Markets', value: cryptoDetails?.data?.coin.numberOfMarkets, icon: <FundOutlined /> },
      { title: 'Number Of Exchanges', value: cryptoDetails?.data?.coin.numberOfExchanges, icon: <MoneyCollectOutlined /> },
      { title: 'Aprroved Supply', value: cryptoDetails?.data?.coin.approvedSupply ? <CheckOutlined /> : <StopOutlined />, icon: <ExclamationCircleOutlined /> },
      { title: 'Total Supply', value: `$ ${cryptoDetails?.data?.coin.totalSupply}`, icon: <ExclamationCircleOutlined /> },
      { title: 'Circulating Supply', value: `$ ${cryptoDetails?.data?.coin.circulatingSupply}`, icon: <ExclamationCircleOutlined /> },
    ];


    return (
        <Col className="coin-detail-container">
            <Col className="coin-heading-container">
                <Title level={2} className="coin-name">
                    {cryptoDetails?.data?.coin.name} ({cryptoDetails?.data?.coin.slug}) Price
                </Title>
                <p>
                    {cryptoDetails?.data?.coin.name} live price in US Dollar (USD). View value statistics, market cap and supply. 
                </p>
            </Col>
            
            <Col style={{margin: "20px 0"}}>
                <Select className="select-timeperiod" placeholder="Select Timeperiod" onChange={(value) => setTimePeriod(value)}> {time.map((date) => <Option key={date}>{date}</Option>)}
                </Select>
                <LineChart coinHistory={coinHistory} currentPrice={cryptoDetails?.data?.coin.price} coinName={cryptoDetails?.data?.coin.name} />
            </Col>
            <Col className="stats-container">
                <Col className="coin-value-statistics">
                   <Col className="coin-value-statistics-heading">
                       <Title level={3} className="coin-details-heading">
                       {cryptoDetails?.data?.coin.name} Value Statistics
                       </Title>
                       <p>An overview showing the statistics of {cryptoDetails?.data?.coin.name}, such as the base and quote currency, the rank, and trading volume.</p>
                    </Col>
                    {stats.map(({ icon, title, value }) => (
                    <Col className="coin-stats">
                        <Col className="coin-stats-name">
                            <Text>{icon}</Text>
                            <Text>{title}</Text>
                        </Col>
                            <Text className="stats">{value}</Text>
                    </Col>
                    ))}
                    
                </Col>
                <Col className="other-stats-info">
                   <Col className="coin-value-statistics-heading">
                       <Title level={3} className="coin-details-heading">
                       Other Stats Info
                       </Title>
                       <p>An overview showing the statistics of all cryptocurrencies for comparison with {cryptoDetails?.data?.coin.name} statistics.</p>
                    </Col>
                    {genericStats.map(({ icon, title, value }) => (
                    <Col className="coin-stats">
                        <Col className="coin-stats-name">
                            <Text>{icon}</Text>
                            <Text>{title}</Text>
                        </Col>
                            <Text className="stats">{value}</Text>
                    </Col>
                    ))}
                    
                </Col>
             </Col>

           
            <Col className="coin-desc-link">
                <Row className="coin-desc">
                    <Title level={3} className="coin-details-heading">
                        What is {cryptoDetails?.data?.coin.name}?
                    </Title>
                    <div dangerouslySetInnerHTML={{ __html: cryptoDetails?.data?.coin.description }} />
                </Row>
                <Col className="coin-links">
                <Title level={3} className="coin-details-heading">{cryptoDetails?.data?.coin.name} Links</Title> 
                {cryptoDetails?.data?.coin.links?.map((link) => (
                <Row className="coin-link" key={link.name}>
                    <Title level={5} className="link-name">{link.type}</Title>
                    <a href={link.url} target="_blank" rel="noreferrer">{link.name}</a>
                </Row>
                ))}
                </Col>
            </Col>
        </Col>
    )
}

export default CryptoDetails
