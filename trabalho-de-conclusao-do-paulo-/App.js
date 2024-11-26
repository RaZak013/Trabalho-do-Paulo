import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Produtos simulados
const products = [
  { id: '1', name: 'Produto A', price: 19.99 },
  { id: '2', name: 'Produto B', price: 39.99 },
  { id: '3', name: 'Produto C', price: 59.99 },
];

// Tela de Produtos
const ProductScreen = ({ navigation }) => (
  <ScrollView contentContainerStyle={styles.container}>
    <Text style={styles.title}>Produtos</Text>
    <FlatList
      data={products}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.productItem}
          onPress={() => navigation.navigate('Carrinho', { product: item })}
        >
          <Text style={styles.productName}>{item.name}</Text>
          <Text style={styles.productPrice}>R$ {item.price.toFixed(2)}</Text>
        </TouchableOpacity>
      )}
      ListFooterComponent={
        <TouchableOpacity
          style={styles.addAllButton}
          onPress={() => navigation.navigate('Carrinho', { addAll: true })}
        >
          <Text style={styles.addAllText}>Adicionar Todos os Produtos</Text>
        </TouchableOpacity>
      }
    />
  </ScrollView>
);

// Tela do Carrinho
const CartScreen = ({ route, navigation }) => {
  const [cartItems, setCartItems] = useState([]);
  const product = route.params?.product;
  const addAll = route.params?.addAll;

  // Adicionar todos os produtos ao carrinho
  if (addAll) {
    setCartItems([
      ...cartItems,
      ...products.map((item) => ({ ...item, quantity: 1 })),
    ]);
    route.params = null; // Limpa o parâmetro após adicionar
  }

  // Adicionar produto ao carrinho
  if (product) {
    const existingItem = cartItems.find((item) => item.id === product.id);
    if (existingItem) {
      existingItem.quantity += 1; // Aumenta a quantidade
      setCartItems([...cartItems]);
    } else {
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
    }
    route.params = null; // Limpa o parâmetro após adicionar
  }

  // Aumentar a quantidade de um produto no carrinho
  const increaseQuantity = (id) => {
    const updatedItems = cartItems.map(item =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    );
    setCartItems(updatedItems);
  };

  // Calcular o total
  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);
  };

  // Finalizar compra
  const finalizePurchase = () => {
    if (cartItems.length === 0) {
      Alert.alert('Carrinho vazio', 'Adicione produtos ao carrinho antes de finalizar a compra!');
    } else {
      navigation.navigate('Finalizado', { total: calculateTotal() });
      setCartItems([]); // Limpa o carrinho
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Carrinho de Compras</Text>
      {cartItems.length > 0 ? (
        <>
          <FlatList
            data={cartItems}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.cartItem}>
                <Text style={styles.productName}>
                  {item.name} (x{item.quantity})
                </Text>
                <Text style={styles.productPrice}>R$ {(item.price * item.quantity).toFixed(2)}</Text>
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={() => increaseQuantity(item.id)}
                >
                  <Text style={styles.addButtonText}>Adicionar mais</Text>
                </TouchableOpacity>
              </View>
            )}
          />
          <Text style={styles.total}>Total: R$ {calculateTotal()}</Text>
          <TouchableOpacity style={styles.checkoutButton} onPress={finalizePurchase}>
            <Text style={styles.checkoutText}>Finalizar Compra</Text>
          </TouchableOpacity>
        </>
      ) : (
        <Text style={styles.empty}>Seu carrinho está vazio</Text>
      )}
    </ScrollView>
  );
};

// Tela de Compra Finalizada
const CheckoutScreen = ({ route }) => {
  const { total } = route.params;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Compra Finalizada</Text>
      <Text style={styles.message}>Obrigado pela compra!</Text>
      <Text style={styles.total}>Total pago: R$ {total}</Text>
      <TouchableOpacity style={styles.backButton} onPress={() => route.navigation.navigate('Produtos')}>
        <Text style={styles.backText}>Voltar para os Produtos</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

// Configuração de Navegação
const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Produtos" component={ProductScreen} />
        <Stack.Screen name="Carrinho" component={CartScreen} />
        <Stack.Screen name="Finalizado" component={CheckoutScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f4f8',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  productItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  productPrice: {
    fontSize: 16,
    color: '#888',
    marginVertical: 5,
  },
  addAllButton: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  addAllText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cartItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  empty: {
    fontSize: 18,
    color: '#aaa',
    textAlign: 'center',
    marginTop: 20,
  },
  total: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'right',
    marginTop: 10,
  },
  addButton: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  checkoutButton: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  checkoutText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  message: {
    fontSize: 20,
    color: '#333',
    textAlign: 'center',
    marginTop: 20,
  },
  backButton: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  backText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
