import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid'; 

import './booktab.css';

import book1 from "/images/erasure.jpg";
import book2 from "/images/harlem_shuffle.jpg";
import book3 from "/images/native_nations.jpg";

const newBooksData = [
 { id: '1', name: "Erasure", author: "by Percival Everett", sale: 233000, price: 493000, image: book1 },
 { id: '2', name: "Erasure", author: "by Percival Everett", sale: 233000, price: 493000, image: book1 },
 { id: '3', name: "Erasure", author: "by Percival Everett", sale: 233000, price: 493000, image: book1 },
 { id: '4', name: "Erasure", author: "by Percival Everett", sale: 233000, price: 493000, image: book1 },
];
const oldBooksData = [
 { id: '1', name: "Erasure", author: "by Percival Everett", sale: 233000, price: 493000, image: book2 },
 { id: '2', name: "Erasure", author: "by Percival Everett", sale: 233000, price: 493000, image: book2 },
];
const rentBooksData = [
 { id: 'r1', name: "Erasure", author: "by Percival Everett", sale: 233000, price: null, image: book3 },
 { id: 'r2', name: "Erasure", author: "by Percival Everett", sale: 233000, price: null, image: book3 },
 { id: 'r3', name: "Erasure", author: "by Percival Everett", sale: 233000, price: null, image: book3 }, 
];

function CustomTabPanel(props) {
 const { children, value, index, ...other } = props;
 return (
  <div
   role="tabpanel"
   hidden={value !== index}
   id={`simple-tabpanel-${index}`}
   aria-labelledby={`simple-tab-${index}`}
   {...other}
  >
   {value === index && <Box sx={{ p: 3, bgcolor: 'transparent' }}>{children}</Box>}
  </div>
 );
}

CustomTabPanel.propTypes = {
 children: PropTypes.node,
 index: PropTypes.number.isRequired,
 value: PropTypes.number.isRequired,
};

function a11yProps(index) {
 return {
  id: `simple-tab-${index}`,
  'aria-controls': `simple-tabpanel-${index}`,
 };
}

const BookItem = ({ name, author, sale, price, image }) => (
 <div className="books-item">
  <div className="books-item-image-wrapper">
   <img src={image} alt={name} className="books-item-image" />
  </div>
  <div className="books-item-details">
   <Typography variant="h6" className="books-title">{name}</Typography>
   <Typography variant="body2" className="books-author">{author}</Typography>
   {price && (
    <Typography variant="body2" className="books-price-original">
     {price.toLocaleString('vi-VN')} vnd
    </Typography>
   )}
   <Typography variant="body1" className="books-price-sale">
    {sale.toLocaleString('vi-VN')} vnd
   </Typography>
  </div>
 </div>
);

BookItem.propTypes = {
  name: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  sale: PropTypes.number.isRequired,
  price: PropTypes.number,
  image: PropTypes.string.isRequired,
};

const BookList = ({ items }) => (
 <Grid container spacing={3}> 
  {items.map((item) => (
   <Grid item xs={12} md={6} key={item.id}>
    <BookItem
     name={item.name}
     author={item.author}
     sale={item.sale}
     price={item.price}
     image={item.image}
    />
   </Grid>
  ))}
 </Grid>
);

BookList.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    sale: PropTypes.number.isRequired,
    price: PropTypes.number,
    image: PropTypes.string.isRequired,
  })).isRequired,
};

export default function BookTabs() {
 const [value, setValue] = React.useState(0); 

 const handleChange = (event, newValue) => {
  setValue(newValue); 
 };

 return (
  <div className="books-tabs-container">
   <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'transparent' }}>
    <Tabs
      value={value}
      onChange={handleChange}
      aria-label="Book categories tabs"
      sx={{
        '& .MuiTab-root': {
          fontWeight: 600,
          color: 'rgba(0, 0, 0, 0.7)'
        },
        '& .Mui-selected': {
          color: 'black !important'
        },
      }}
    >
     <Tab label="Sách mới" {...a11yProps(0)} />
     <Tab label="Sách cũ" {...a11yProps(1)} />
     <Tab label="Thuê sách" {...a11yProps(2)} />
    </Tabs>
   </Box>

   <CustomTabPanel value={value} index={0}>
    <BookList items={newBooksData} />
   </CustomTabPanel>
   <CustomTabPanel value={value} index={1}>
    <BookList items={oldBooksData} />
   </CustomTabPanel>
   <CustomTabPanel value={value} index={2}>
    <BookList items={rentBooksData} />
   </CustomTabPanel>
  </div>
 );
}
