import { CSSProperties, FC, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { DownloadOutlined, ReloadOutlined } from '@ant-design/icons'
import { Table, Button, message } from 'antd'
import styles from './DataTable.module.scss'

const downloadButtonStyle: CSSProperties = {
  padding: '21px 20px',
  boxSizing: 'border-box',
  fontSize: 20,
  borderRadius: 5,
  backgroundColor: '#0489FA',
}

const returnButtonStyle: CSSProperties = {
  padding: '21px 20px',
  boxSizing: 'border-box',
  fontSize: 20,
  borderRadius: 5,
  color: '#393939',
  borderColor: '#DEEAF9',
  backgroundColor: 'transparent',
  boxShadow: 'none',
}

const columns = [
  {
    title: 'ID клиента',
    dataIndex: 'id',
  },
  {
    title: 'Ранний выход на пенсию',
    dataIndex: 'earlyRetirement',
    filters: [
      {
        text: 'Да',
        value: 1,
      },
      {
        text: 'Нет',
        value: 0,
      },
    ],
    //@ts-expect-error Ant Design Library TS problems
    onFilter: (value: number, record) => record.earlyRetirement === value,
    width: '25%',
  },
  {
    title: 'Пенсионный статус',
    dataIndex: 'status',
  },
]

const datas = [
  {
    key: 1,
    id: '1',
    earlyRetirement: 0,
    status: 'на пенсии 15 лет',
  },
  {
    key: 2,
    id: '2',
    earlyRetirement: 0,
    status: 'до пенсии 20 лет',
  },
  {
    key: 3,
    id: '3',
    earlyRetirement: 1,
    status: 'на пенсии 10 лет',
  },
  {
    key: 4,
    id: '4',
    earlyRetirement: 0,
    status: 'на пенсии 30 лет',
  },
]

const DataTable: FC = () => {
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [data, setData] = useState('')

  const handleDownload = () => {}

  const handleReturn = () => {
    navigate('/upload')
  }

  const csvToJson = (csvString: string) => {
    const rows = csvString.split('\n')

    const headers = rows[0].split(',')

    const jsonData = []
    for (let i = 1; i < rows.length; i++) {
      const values = rows[i].split(',')

      const obj = {}

      for (let j = 0; j < headers.length; j++) {
        const key = headers[j].trim()
        const value = values[j].trim()
        //@ts-expect-error Not important
        obj[key] = value
      }

      jsonData.push(obj)
    }
    return JSON.stringify(jsonData)
  }

  useEffect(() => {
    axios
      .get('https//v2016237.hosted-by-vdsina.ru/predict/results/')
      .then(response => {
        setLoading(true)
        setData(response.data.stringify)

        const jsonData = csvToJson(data)

        console.log(jsonData)
      })
      .catch(() => {
        message.error('Не удалось загрузить данные с сервера')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  return (
    <div className={styles.container}>
      <div className={styles.table}>
        {loading ? (
          <p className={styles.text}>
            Результат будет отображен в данном окне, пожалуйста подождите
          </p>
        ) : (
          <>
            {
              //@ts-expect-error Ant Design Library TS problems
              <Table columns={columns} bordered dataSource={datas} />
            }
            <p className={styles.hint}>
              Загруженные файлы и таблицы вы можете посмотреть в личном кабинете
              в разделе «Результаты прогнозирования»
            </p>
            <div className={styles.row}>
              <Button
                type='primary'
                icon={<DownloadOutlined />}
                onClick={handleDownload}
                style={downloadButtonStyle}
              >
                Скачать файл
              </Button>
              <Button
                type='primary'
                icon={<ReloadOutlined />}
                onClick={handleReturn}
                style={returnButtonStyle}
              >
                Загрузить новый датасет
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default DataTable
