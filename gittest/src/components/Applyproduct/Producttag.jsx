import React from 'react'
import { TextField, Card, OptionList, Scrollable, Button, Icon, Badge, Stack, Tag } from '@shopify/polaris'
import { useState, useCallback, } from 'react';
import { useQuery, gql } from '@apollo/client';
import {
    CirclePlusMinor
} from '@shopify/polaris-icons';

const getAllProducts = gql`
query{
    shop {
        currencyCode
        productTags(first:100) {
          edges {
            cursor
            node
          }
        }
      }
  }
`

const getAllProductstag = gql`
query{
  products(first:100){
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
}`




export const Producttag = ({ handelgetvalue }) => {
    const [tagOption, setTagOption] = useState([])
    const [items, setItems] = useState([])
    const [activeTag, setActiveTag] = useState(true);
    const [isLoading, setIsLoading] = useState(true)
    const [allproduct, setAllproduct] = useState([])

    const { data1, loading1 } = useQuery(getAllProductstag, {
        onCompleted(data1) {
            const datapro = data1.products.edges
            const datatag = datapro.map((el) => {
                return el.node.tags
            })
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
            for (let i = 0; i < datapro.length; i++) {
                data2.push({
                    name: datatitle[i],
                    id: dataID[i],
                    url: dataUrlImage[i],
                    price: dataprice[i],
                    tag: datatag[i]
                })
            }

            setAllproduct(data2)
        },
        onError(err) {
            console.log(err);
        },
    })


    const { data, loading } = useQuery(getAllProducts, {
        onCompleted(data) {
            const datapro = data.shop.productTags.edges
            const dataset = []
            for (let i = 0; i < datapro.length; i++) {
                dataset.push({
                    value: datapro[i].cursor,
                    label: datapro[i].node,
                })
            }
            console.log(dataset)
            setTagOption(dataset)
            setIsLoading(false)
        },
        onError(err) {
            console.log(err);
        },
    })


    const [selected, setSelected] = useState([]);
    const [textFieldValue, setTextFieldValue] = useState(``);
    const handleTextFieldChange =
        (value) => {
            setTextFieldValue(value)
        }
    // Kiểm soát khi docus vào ô input 
    const [activeOptionlist, setActiveOptionlist] = useState(false);
    const handleOpenMudal = useCallback(() => {
        setActiveOptionlist(true)
        setActiveTag(false)
    }, [activeOptionlist]);
    const handleclose = useCallback(() => {
        setActiveOptionlist(false)
    }, [activeOptionlist]);


    const handelAddTag = useCallback(() => {
        const arr = []
        const arrfinal = []
        const arrset = []
        for (let i = 0; i < selected.length; i++) {
            const arr1 = tagOption.filter((el) => {
                if (el.value == selected[i]) {
                    return el
                }
            })

            const [arr2] = arr1
            arr.push(arr2.label)
            arrset.push(arr2)

        }

        for (let i = 0; i < arr.length; i++) {
            const arrdata = allproduct.filter((el) => {
                const abc=arr[i]
                const arrset = el.tag
                let isOK = false
                for (let i = 0; i < arrset.length; i++) {
                    if (arrset[i] == abc) {
                        isOK= true;
                    }
                }
                return isOK
            })
 
            arrfinal.push(arrdata)
        }
        const arr6 = []
        arrfinal.map((el)=>{
            for (let i = 0; i < el.length; i++) {
                arr6.push(el[i])
            }
        })
        console.log(arr6)
        handelgetvalue(arr6)
        setSelectedTags(arr)
        setActiveTag(true)
        setActiveOptionlist(false)
    });




    const [selectedTags, setSelectedTags] = useState([]);

    const removeTag = useCallback(
        (tag) => () => {

            setSelectedTags((previousTags) =>
                previousTags.filter((previousTag) => previousTag !== tag),
            );
            setSelected(
                (previousTags) =>
                    previousTags.filter((previousTag) => previousTag !== tag)
            )
        },
        [],
    );
    const tagMarkup = selectedTags.map((option) => (
        <Tag key={option} onRemove={removeTag(option)}>
            {option}
        </Tag>
    ));

    return (
        <Card onBlur={handleclose}>
            <TextField
                placeholder='Vintage, cotton, summer'
                onChange={handleTextFieldChange}
                value={textFieldValue}
                autoComplete="off"
                onFocus={handleOpenMudal}

            />
            {activeOptionlist && <>
                <Button onClick={handelAddTag} fullWidth >
                    <>
                        <Stack>
                            <Badge>
                                <div style={{
                                    display: 'flex',
                                    backgroundcolor: 'rgb(3, 97, 39)'
                                    ,
                                }}>
                                    <Icon
                                        source={CirclePlusMinor}
                                        color="subdued"
                                    />
                                    Add
                                </div>

                            </Badge>
                        </Stack>
                    </>
                </Button>
                <Scrollable shadow style={{ height: '300px' }}>
                    <OptionList
                        title="Product tag"
                        onChange={setSelected}
                        options={
                            tagOption
                        }
                        selected={selected}
                        allowMultiple
                        loading={isLoading}
                    />
                </Scrollable>
            </>
            }
            {
                activeTag && <div className='Pro__tag__hidden' style={{ height: '40px', width: '100%' }} >
                    <Stack spacing="tight">{tagMarkup}</Stack>
                </div>
            }
        </Card>
    )
};
