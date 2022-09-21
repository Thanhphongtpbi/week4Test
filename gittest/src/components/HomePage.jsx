
import React from 'react'
import { Page, Layout, Card, Select, ChoiceList, InlineError, Button, IndexTable, useIndexResourceState } from '@shopify/polaris';
import { TextField } from '@shopify/polaris';
import { useState, useCallback, } from 'react';
import { useQuery, gql } from '@apollo/client';
import {
  ResourceList,
  Avatar,
  ResourceItem,
  TextStyle,
} from '@shopify/polaris';
import { Speciffic } from '../components/Applyproduct/Speciffic';
import { Collection } from '../components/Applyproduct/Collections';
import { Producttag } from '../components/Applyproduct/Producttag';
import { Showprices } from '../components/Applyproduct/Showprices'
import "../Css/Product.css"
import trophyImgUrl from "../assets/home-trophy.png";


const getAllProducts = gql`
query{
  products(first:10){
    edges{
      node{
        id
        title
        images(first:1){
          edges{
            node{
              id
              url
            }
          }
        }
        tags
        totalVariants
        variants(first:1){
          edges{
            node{
              id
              title
              price
            }
          }
        }
      }
    }
  }
}
`

export function HomePage() {








  // Biến và hàm trường Name
  const [datacallItemprice, setDatacallItemprice] = useState([])
  const [dataShowItemprice, setDataShowItemprice] = useState([])
  // Ham call api 

  const { data, loading } = useQuery(getAllProducts, {
    onCompleted(data) {
      const datapro = data.products.edges
      const dataVariants = datapro.map((el) => {
        return el.node.variants.edges
      })
      const dataimage = datapro.map((el) => {
        return el.node.images.edges
      })
      const datatitle = datapro.map((el) => {
        return el.node.title
      })
      const dataID = datapro.map((el) => {
        return el.node.id
      })
      const dataUrlImage = dataimage.map((el) => {
        const [data] = el
        return data.node.url
      })
      const dataprice = dataVariants.map((el) => {
        const [data] = el
        return data.node.price
      })
      const data2 = []
      for (let i = 0; i < 10; i++) {
        data2.push({
          name: datatitle[i],
          id: dataID[i],
          url: dataUrlImage[i],
          price: dataprice[i]
        })
      }
      setDatacallItemprice(data2)
    },
    onError(err) {
      console.log(err);
    },
  })




  const [textNameValue, setTextNameValue] = useState();
  // Validate trường name 
  const isValueInvalid = (content) => {
    if (!content) {
      return true;
    }
    return false
  }
  const isInvalidName = isValueInvalid(textNameValue);
  const errorMessagename = isInvalidName
    ? 'Name is required'
    : '';
  const handleTextNameValueChange = useCallback((newValue) => {
    setTextNameValue(newValue)
  }, []);



  // Validate trường Priority
  const isValueInvalidPriority = (content) => {
    if (!(content > 0 && content % 1 == 0 && content < 100)) {
      return true;
    }
    return false
  }
  const [valuePriority, setValuePriority] = useState('1');
  const isInvalidPriority = isValueInvalidPriority(valuePriority);
  const errorMessagePriority = isInvalidPriority
    ? 'Priority must be an interger from 0 to 99 '
    : ''
  const handleChange = useCallback((value) => {
    if (Number(value) <0|| Number(value) >99) {
      setValuePriority("0")
    } else {
      setValuePriority(value)
    }
  }, []);


  // Hàm và biến của Status
  const handleSelectChange = useCallback((value) => setSelectValue(value), []);
  const [selectValue, setSelectValue] = useState('kg');





  // Hàm hiển thị choApply products
  // Biến và hàm cho Apply products
  const [selectedApply, setSelectedApply] = useState(['All Products']);
  // Biến và hàm cho Apply products- Speciffic products
  const handleChoiceListChange = useCallback((value) => {
    setSelectedApply(value)
  }
    , []);
  // Hàm hiển thị giá trị sản phẩm 
  const [selectedCustomPrices, setSelectedCustomPrices] = useState(['Apply']);
  const handleChangechoiceCustomPrices = (value) => setSelectedCustomPrices(value);

  // Các biến truyền xuống component con 
  const [dataSpecifficproducts, setDataSpecifficproducts] = useState([])
  const [dataProductsCollections, setDataProductscollections] = useState([])
  const [dataProductstags, setDataProductstags] = useState([])

  const handleSetValueSpeciffic = (value) => {
    setDataSpecifficproducts(value)
    console.log(value)
  }
  const handleSetValueCollections = (value) => {
    const data = value
    const dataVariants = data.map((el) => {
      return el.node.variants.edges
    })
    const datatitle = data.map((el) => {
      return el.node.title
    })
    const dataprice = dataVariants.map((el) => {
      const [data] = el
      return data.node.price
    })
    const data2 = []
    for (let i = 0; i < data.length; i++) {
      data2.push({
        name: datatitle[i],
        price: dataprice[i]
      })
    }
    console.log(data2)
    setDataProductscollections(data2)
  }
  const handleSetValueProductstags = (value) => {
    const data = value
    const datatitle = data.map((el) => {
      return el.name
    })
    const dataprice = data.map((el) => {
      return el.price
    })
    const data2 = []
    for (let i = 0; i < data.length; i++) {
      data2.push({
        name: datatitle[i],
        price: dataprice[i]
      })
    }
    console.log(data2)
    setDataProductstags(value)
  }





  // Hàm lấy giá trị  in put của Apply a price selectd products
  const [textCustomPricesValue, setTextCustomPricesValue] = useState(`1`);
  const handleTextSamePriceChange = (
    (value) => {
      if (Number(value) <0) {
        setTextCustomPricesValue("0")
      } else {
        setTextCustomPricesValue(value)
      }
    }
  );

  // Hàm vadiate của Custom prices
  const isValueInvalidApplyprices = (content) => {
    if (!(content > 0)) {
      return true;
    }
    return false
  }
  const isInvalidApplyprices = isValueInvalidApplyprices(textCustomPricesValue);
  const errorMessageApplyprices = isInvalidApplyprices
    ? 'The Price must be an interger greater than 0'
    : ''






  // Hàm lấy giá trị  in put của Apply a price OriginalPrice
  const [textOriginalPricesValue, setTextOriginalPricesValue] = useState(`1`);
  const handleTextOriginalPricesChange = (
    (value) => {
      if (Number(value) <0) {
        setTextOriginalPricesValue("0")
      } else {
        setTextOriginalPricesValue(value)
      }
    }
  );
  // Hàm vadiate của Custom prices
  const isValueInvalidOriginalPrices = (content) => {
    if (!(content > 0)) {
      return true;
    }
    return false
  }
  const isInvalidOriginalPrices = isValueInvalidOriginalPrices(textOriginalPricesValue);
  const errorMessageOriginalPrices = isInvalidOriginalPrices
    ? 'The amount must be an interger greater than 0 '
    : ''



  // Hàm lấy giá trị  in put của Apply a price PercentagePricesproducts
  const [textPercentagePricesValue, setTextPercentagePricesValue] = useState(`1`);
  const handleTextPercentagePricesChange = (
    (value) => {
      if (Number(value) <0|| Number(value) >99) {
        setTextPercentagePricesValue("0")
      } else {
        setTextPercentagePricesValue(value)
      }
    }
  );


  // Hàm vadiate của Custom prices
  const isValueInvalidPercentagePrices = (content) => {
    if (!(content > 0 && content % 1 == 0 && content < 100)) {
      return true;
    }
    return false
  }
  const isInvalidPercentagePrices = isValueInvalidPercentagePrices(textPercentagePricesValue);
  const errorMessagePercentagePrices = isInvalidPercentagePrices
    ? 'The Percentage be an interger from 0 to 99 '
    : ''



  // Hàm xử lý add bảng 
  const [dataSpeciffic, setDataSpeciffic] = useState('')
  const rows = [
  ];

  // Khu vực xử lý lưu câu hình discount
  const [dataDiscount, setDataDiscount] = useState([])
  const [dataDiscountShow, setDataDiscountShow] = useState({
    name: "",
    content: "",
    type: "",
    productApply: [],
    value: [],
    Valuenumber: 0
  })

  const handleSaveDiscount = useCallback(() => {

    const data = dataDiscount
    let datatow = []
    let datathree = []
    let dataset = '';
    let dataapply = '';
    let datanumber = 0

    if (selectedApply == 'Speciffic products') {
      datatow = dataSpecifficproducts.map((el) => {
        return [el.name, el.price]
      })
    }
    if (selectedApply == 'Products collections') {
      datatow = dataProductsCollections.map((el) => {
        return [el.name, el.price]
      })
    }
    if (selectedApply == 'Products tags') {
      datatow = dataProductstags.map((el) => {
        return [el.name, el.price]
      })
    }
    if (selectedApply == 'All Products') {
      datatow = datacallItemprice.map((el) => {
        return [el.name, el.price]
      })
      console.log(datatow)
    }



    if (selectedCustomPrices == 'Apply') {
      datathree = datatow.map((el) => {
        if (Number(textCustomPricesValue)>=Number(el[1]) ) {
          return [el[0], el[1], el[1]]
        } else {
          return [el[0], el[1], textCustomPricesValue]
        }
      })
    }

    if (selectedCustomPrices == 'original') {

      datathree = datatow.map((el) => {
        if (Number(textOriginalPricesValue)  >= Number(el[1]) ) {
          return [el[0], el[1], 0]
        } else {
          return [el[0], el[1], el[1] - Number(textOriginalPricesValue)]
        }
      })
    }

    if (selectedCustomPrices == 'percentage') {
      datathree = datatow.map((el) => {
        return [el[0], el[1], (el[1] * (100 - Number(textPercentagePricesValue)) / 100)]
      })
    }
    // setDataDiscountShow({
    //   name: textNameValue,
    //   content: dataapply,
    //   type: selectedCustomPrices,
    //   productApply: selectedApply,
    //   value: dataset,
    //   Valuenumber: datanumber
    // })
    // data.push({
    //   name: textNameValue,
    //   content: dataapply,
    //   type: selectedCustomPrices,
    //   productApply: selectedApply,
    //   value: dataset,
    //   Valuenumber: datanumber
    // })
    setDataShowItemprice(datathree)
    setDataDiscount(data)
  }, [textNameValue, selectedApply, dataSpecifficproducts, dataProductsCollections, dataProductstags,
    textPercentagePricesValue, textCustomPricesValue, textOriginalPricesValue
  ])


  return (
    <Page fullWidth
      title='New Pricing rule'
    >
      <Layout>
        <Layout.Section oneHalf>
          <Layout>
            <Layout.Section >
              <Card title="General imformation" sectioned>
                <TextField oneTwo
                  label="Name"
                  value={textNameValue}
                  onChange={handleTextNameValueChange}
                  autoComplete="off"
                  id='name'
                />
                <div style={{
                  height: '30px',
                  width: '100%',
                }} >
                  <InlineError message={errorMessagename} fieldID='name' />
                </div>

                <TextField oneTwo
                  type="number"
                  label="Priority"
                  autoComplete="off"
                  value={valuePriority}
                  onChange={handleChange}
                  id='Priority'
                />
                <div style={{
                  height: '30px',
                  width: '100%',
                }} >
                  <InlineError message={errorMessagePriority} fieldID='Priority' />
                </div>
                <Select
                  value={selectValue}
                  onChange={handleSelectChange}
                  options={['Enable', 'Disable']}
                  label="Status"
                />
              </Card>
            </Layout.Section>
            <Layout.Section >
              <Card title="Apply to Products" sectioned>
                <ChoiceList
                  choices={[
                    { label: 'All Products', value: 'All Products' },
                    {
                      label: 'Speciffic products',
                      value: 'Speciffic products',
                      renderChildren: () => selectedApply == 'Speciffic products' && <Speciffic handelgetvalue={handleSetValueSpeciffic} />
                    },
                    {
                      label: 'Products collections',
                      value: 'Products collections',
                      renderChildren: () => selectedApply == 'Products collections' && <Collection handelgetvalue={handleSetValueCollections} />
                    },
                    {
                      label: 'Products tags',
                      value: 'Products tags',
                      renderChildren: () => selectedApply == 'Products tags' && <Producttag handelgetvalue={handleSetValueProductstags} />
                    },

                  ]}
                  selected={selectedApply}
                  onChange={handleChoiceListChange}
                />
              </Card>
            </Layout.Section>
            <Layout.Section >
              <Card title="Custom Prices" sectioned>
                <ChoiceList
                  title=""
                  choices={[
                    {
                      label: 'Apply a price selectd products',
                      value: 'Apply',
                      renderChildren: () => selectedCustomPrices == 'Apply' && (
                        <>
                          <p className='Product__Text__Mess'> The Prices of product is the same </p>
                          <TextField
                            label="Prices"
                            type="number"
                            onChange={handleTextSamePriceChange}
                            value={textCustomPricesValue}
                            autoComplete="off"
                            prefix="$"
                          />
                          <div style={{
                            height: '30px',
                            width: '100%',
                          }} >
                            <InlineError message={errorMessageApplyprices} fieldID='Priority' />
                          </div>

                        </>
                      )
                    },
                    {
                      label: 'Decrease a fixed amount of the original prices of selected  products ',
                      value: 'original',
                      renderChildren: () => selectedCustomPrices == 'original' && (
                        <>
                          <p className='Product__Text__Mess'> The Prices of product is Decreacse fix</p>
                          <TextField
                            label="Amount"
                            type="number"
                            onChange={handleTextOriginalPricesChange}
                            value={textOriginalPricesValue}
                            autoComplete="off"
                            prefix="$"
                          />
                          <div style={{
                            height: '30px',
                            width: '100%',
                          }} >
                            <InlineError message={errorMessageOriginalPrices} fieldID='Priority' />
                          </div>
                        </>
                      )
                    },
                    {
                      label: 'Decreacse the  oriinal prices  of selected products by a percentage (%)',
                      value: 'percentage',
                      renderChildren: () => selectedCustomPrices == 'percentage' && (
                        <>
                          <TextField
                            label="Percentage"
                            type="number"
                            onChange={handleTextPercentagePricesChange}
                            value={textPercentagePricesValue}
                            autoComplete="off"
                            prefix="%"
                          />
                          <div style={{
                            height: '30px',
                            width: '100%',
                          }} >
                            <InlineError message={errorMessagePercentagePrices} fieldID='Priority' />
                          </div>
                        </>
                      )
                    },
                  ]}
                  selected={selectedCustomPrices}
                  onChange={handleChangechoiceCustomPrices}
                />
                <div style={{
                  height: '10px',
                  width: '100%',
                }} >
                </div>
              </Card>
            </Layout.Section>
            <Layout.Section>
              <div className='Pro__Button'>
                <Button primary onClick={handleSaveDiscount} >Save Discount</Button>
              </div>
            </Layout.Section>
          </Layout>
        </Layout.Section>
        <Layout.Section oneHalf>
          <Card title="Show product priccing" sectioned>
            <Showprices datashow={dataShowItemprice} />
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}

