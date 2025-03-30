import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { TextInput, List, Button, Card, Modal, Portal, PaperProvider } from 'react-native-paper';
import { useState } from 'react';

export default function App() {
  let [cep, setCep] = useState('');
  let [dados, setDados] = useState({});
  const [expanded, setExpanded] = useState(false);
  const [selectedValue, setSelectedValue] = useState(null);
  const [visible, setVisible] = useState(false);
  
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const containerStyle = { backgroundColor: 'white', padding: 20, margin: '30%', borderRadius: 10, alignSelf: 'center', width: '40%', minWidth: 250,};

  const handlePress = () => setExpanded(!expanded);
  const handleItemPress = (value) => {
    setSelectedValue(value);
    setExpanded(false);
  };

  const BuscaCep = (xcep) => {
    if (xcep.length !== 8 || isNaN(xcep)) {
      showModal();
      setDados({});
      setSelectedValue(null);
      return;
    }
    
    let url = `https://viacep.com.br/ws/${xcep}/json/`;

    fetch(url)
      .then((resp) => resp.json())
      .then((dados) => {
        if (dados.erro) {
          showModal();
          setDados({});
          setSelectedValue(null);
        } else {
          setDados(dados);
          setSelectedValue(dados.uf);
        }
      })
      .catch((x) => console.log(x));
  };

  return (
    <PaperProvider>
      <ScrollView contentContainerStyle={styles.container}>
        <Card style={styles.card}>
          <Card.Title title="Formulário" subtitle="Preencha os campos abaixo" titleStyle={styles.cardTitle} />
          <Card.Content>
            <TextInput label='Nome' mode='outlined' style={styles.input} />
            <TextInput label='Email' mode='outlined' style={styles.input} />
            <TextInput
              label='CEP'
              onChangeText={(value) => setCep(value)}
              mode='outlined'
              keyboardType='numeric'
              onBlur={() => BuscaCep(cep)}
              style={styles.input}
            />
            <TextInput
              label='Rua'
              value={dados.logradouro || ''}
              onChangeText={(value) => setDados({ ...dados, logradouro: value })}
              mode='outlined'
              style={styles.input}
            />
            <TextInput label='Número' mode='outlined' style={styles.input} />
            <TextInput label='Complemento' mode='outlined' style={styles.input} />
            <TextInput
              label='Bairro'
              mode='outlined'
              value={dados.bairro || ''}
              onChangeText={(value) => setDados({ ...dados, bairro: value })}
              style={styles.input}
            />
            <TextInput
              label='Cidade'
              mode='outlined'
              value={dados.localidade || ''}
              onChangeText={(value) => setDados({ ...dados, localidade: value })}
              style={styles.input}
            />
            <List.Section title="Estado">
              <List.Accordion
                title={selectedValue ? selectedValue : 'Selecione o Estado'}
                expanded={expanded}
                onPress={handlePress}
                style={styles.accordion}
                titleStyle={styles.accordionTitle}
              >
                {['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'].map((estado) => (
                  <List.Item key={estado} title={estado} onPress={() => handleItemPress(estado)} titleStyle={styles.accordionTitle} />
                ))}
              </List.Accordion>
            </List.Section>
            <Button mode="contained" style={styles.button}>Enviar</Button>
          </Card.Content>
        </Card>
        <StatusBar style="auto" />
      </ScrollView>
      <Portal>
        <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={containerStyle}>
          <Text style={styles.modalText}>CEP não encontrado ou inválido!</Text>
          <Button onPress={hideModal} mode="contained" style={styles.modalButton}>Fechar</Button>
        </Modal>
      </Portal>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  card: {
    padding: 10,
    borderRadius: 10,
  },
  input: {
    marginBottom: 10,
  },
  button: {
    marginTop: 10,
  },
});
