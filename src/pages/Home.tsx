import * as React from 'react'
import { IonHeader, IonPage, IonToolbar, IonButtons, IonButton } from '@ionic/react'
import { isPlatform } from '@ionic/react'
import { jsonToCSV, readString } from 'react-papaparse'
import { data } from '../datasource/data'
import { saveAsCSV } from '../services/file.service'
import { openCSVFile } from '../services/fileOpener.service'

const Home: React.FC = () => {
  const [csvData, setCSVData] = React.useState<any[]>([])
  const [headerRow, setHeaderRow] = React.useState<any[]>([])

  React.useEffect(() => {
    extractData(jsonToCSV(data))
  }, [])

  const extractData = (res: string) => {
    let csvData = res || ''

    readString(csvData, {
      complete: (parsedData) => {
        const p = parsedData as any
        setHeaderRow(p.data.splice(0, 1)[0])
        setCSVData(parsedData.data)
      },
    })
  }

  const handleExport = async () => {
    let csv = jsonToCSV({
      fields: headerRow,
      data: csvData,
    })

    let blob = new Blob([csv], {
      type: 'text/csv',
    })

    if (isPlatform('cordova')) {
      try {
        const saved = await saveAsCSV(blob)
        if (saved) {
          console.log('saved::', saved.nativeURL)
          const openfile = await openCSVFile(saved.nativeURL)
          console.log('opned', openfile)
        }
      } catch (error) {
        console.error(error)
      }
    }
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color='primary'>
          <IonButtons slot='start'>
            <IonButton onClick={handleExport}>Export</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
    </IonPage>
  )
}

export default Home
