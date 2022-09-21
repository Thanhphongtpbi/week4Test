import React from 'react'
import { TextField, Modal, Icon, Card, ResourceList, Thumbnail, TextStyle, ResourceItem, Scrollable, Button } from '@shopify/polaris'
import { useState, useCallback } from 'react';
import { useQuery, gql } from '@apollo/client';
import {
    CircleCancelMajor
} from '@shopify/polaris-icons';





const getAllProducts = gql`
query{
    collections(first:10){
      edges{
        node{
          id
          title
          image{
            id
            url
          }
          products(first:10){
            edges{
              node{
                id
                title
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
      }
    }
  }
`

export const Collection = ({ handelgetvalue }
) => {

    const [itemsColections, setItemsColection] = useState([])
    const [isloading, setIsloading] = useState(true)
    const [allproduct, setAllproduct] = useState()
    const { data, loading } = useQuery(getAllProducts, {
        onCompleted(data) {
            const datapro = data.collections.edges
            const dataimage = datapro.map((item) => {
                return item.node.image
            })
            const datatitle = datapro.map((item) => {
                return item.node.title
            })
            const dataID = datapro.map((item) => {
                return item.node.id
            })
            const dataUrlImage = dataimage.map((item) => {
                return item.url
            })
            const dataproduct = datapro.map((item) => {
                return [item.node.products.edges, item.node.id]
            })
            const data2 = []
            for (let i = 0; i < datapro.length; i++) {
                data2.push({
                    name: datatitle[i],
                    id: dataID[i],
                    url: dataUrlImage[i]
                })
            }
            setItemsColection(data2)
            setAllproduct(dataproduct)
            setIsloading(false)
        },
        onError(err) {
            console.log(err);
        },
    })

    // Hiển thị modal 
    const [textFieldValue, setTextFieldValue] = useState(``);
    const handleTextFieldChange = useCallback(
        (value) => {
            setTextFieldValue(value)
        },
        [],
    );
    //  Biến nhận giá trị là nội dung text search

    const [selectedItems, setSelectedItems] = useState([]);
    const [activeMudal, setActiveMudal] = useState(false);
    const handleOpenMudal = useCallback(() => {
        setActiveMudal(!activeMudal);
        setSelectedItems(ItemsaveString)
    }, [activeMudal])

    const [valueSearch, setValueSearch] = useState();
    const handleChangesearchspecific = (newValue) => {
        setValueSearch(newValue)
        console.log(valueSearch)
    };
    const resourceName = {
        singular: 'customer',
        plural: 'customers',
    };




    const [isChoice, setIsChoice] = useState(true)
    const [Itemsave, setItemsave] = useState([])
    const [ItemsaveString, setItemsaveString] = useState([])
    const handleSaveProduct = useCallback(() => {
        const arr = []
        const arr4 = []
        for (let i = 0; i < selectedItems.length; i++) {
            const arr1 = itemsColections.filter((el) => {
                if (el.id == selectedItems[i]) {
                    return el
                }
            })
            const [arr2] = arr1
            arr.push(arr2)
        }
        for (let i = 0; i < selectedItems.length; i++) {
            const arr3 = allproduct.filter((el) => {
                if (el[1] == selectedItems[i]) {
                    return el
                }
            })
            const [arr2] = arr3
            arr4.push(arr2)
        }
        const arr5 = arr4.map((el)=>{
            return el[0]
        })
        console.log(arr5)
        const arr6 = []
        arr5.map((el)=>{
            for (let i = 0; i < el.length; i++) {
                arr6.push(el[i])
            }
        })

        setItemsave(arr)
        handelgetvalue(arr6)
        setItemsaveString(selectedItems)
    }, [selectedItems])
    return (
        <div style={{
            // display: 'inline-flex',
            height: '100%',
            width: '100%',
        }}>
            <>
                <TextField
                    label="Minimum Quantity"
                    labelHidden
                    placeholder='Search collection'
                    onChange={handleTextFieldChange}
                    value={textFieldValue}
                    autoComplete="off"
                    onFocus={handleOpenMudal}
                />
                {isChoice &&
                    <div>
                        <ResourceList
                            resourceName={{ singular: 'customer', plural: 'customers' }}
                            items={Itemsave}
                            renderItem={(item) => {
                                const { id, url, name } = item;
                                const media = <Thumbnail
                                    source={url}
                                    alt="Black choker necklace"
                                />;
                                return (
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: "space-between",

                                    }}>
                                        <ResourceItem
                                            id={id}
                                            url={url}
                                            media={media}
                                            accessibilityLabel={`View details for ${name}`}
                                        >
                                            <h3>
                                                <TextStyle variation="strong">{name}</TextStyle>
                                            </h3>

                                        </ResourceItem>
                                        <Button><Icon source={CircleCancelMajor} /></Button>
                                    </div>

                                );
                            }}
                        />
                    </div>
                }

                <Modal
                    open={activeMudal}
                    onClose={handleOpenMudal}
                    title="Select Specific Products"
                >
                    <Modal.Section>
                        <TextField
                            label="Search Collections"
                            value={valueSearch}
                            onChange={handleChangesearchspecific}
                            autoComplete="off"
                        />
                        <Scrollable shadow style={{ height: '400px' }} >
                            <Card>
                                <ResourceList
                                    resourceName={resourceName}
                                    items={itemsColections}
                                    renderItem={renderItem}
                                    selectedItems={selectedItems}
                                    onSelectionChange={setSelectedItems}
                                    selectable
                                    loading={isloading}
                                />
                            </Card>

                        </Scrollable>
                        <div style={{ height: '40px', width: '100%', display: 'flex', justifyContent: "flex-end" }}><Button onClick={handleSaveProduct} primary> Select</Button></div>
                    </Modal.Section>
                </Modal>
            </>
        </div>
    )
}

function renderItem(item) {
    const { id, url, name, location } = item;
    const media = <Thumbnail
        source={url}
        alt="Black choker necklace"
    />;

    return (
        <ResourceItem
            id={id}
            url={url}
            media={media}
            accessibilityLabel={`View details for ${name}`}
        >
            <h3>
                <TextStyle variation="strong">{name}</TextStyle>
            </h3>
            <div>{location}</div>
        </ResourceItem>
    );
}
