import React from "react";
import {
  StyleSheet,
  SafeAreaView,
  View,
  TextInput,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  Modal,
  Image,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
const COLORS = { primary: "#1f145c", white: "#fff" };

const App = () => {
  const [todos, setTodos] = React.useState([]);
  const [textInput, setTextInput] = React.useState("");
  const [textInput1, setTextInput1] = React.useState("");
  const [modalVisible, setModalVisible] = React.useState(false);
  const [modalDelete, setModalDelete] = React.useState(false);

  React.useEffect(() => {
    getTodosFromUserDevice();
  }, []);

  React.useEffect(() => {
    saveTodoToUserDevice(todos);
  }, [todos]);

  const addContact = () => {
    setModalVisible(!modalVisible);
    if (textInput == "" && textInput1 == "") {
      Alert.alert("Error", "Please input todo");
    } else {
      const newTodo = {
        id: Math.random(),
        task: textInput,
        task1: textInput1,
        completed: false,
      };
      setTodos([...todos, newTodo]);
      setTextInput("");
      setTextInput1("");
    }
  };
  const closeModal = () => {
    setModalVisible(!modalVisible);
  };
  const closeModalDelete = () => {
    setModalDelete(!modalDelete);
  };
  const saveTodoToUserDevice = async (todos) => {
    try {
      const stringifyTodos = JSON.stringify(todos);
      await AsyncStorage.setItem("todos", stringifyTodos);
    } catch (error) {
      console.log(error);
    }
  };

  const getTodosFromUserDevice = async () => {
    try {
      const todos = await AsyncStorage.getItem("todos");
      if (todos != null) {
        setTodos(JSON.parse(todos));
      }
    } catch (error) {
      console.log(error);
    }
  };
  const deleteTodo = (todoId) => {
    setModalDelete(!modalDelete);
    const newTodosItem = todos.filter((item) => item.id != todoId);
    setTodos(newTodosItem);
  };

  const ListItem = ({ todo }) => {
    return (
      <View style={styles.listItem}>
        <View style={{ flex: 1 }}>
          <View style={styles.centeredView}>
            <Modal
              animationType="slide"
              transparent={true}
              visible={modalDelete}
              onRequestClose={() => {
                setModalDelete(!modalDelete);
              }}
            >
              <View style={styles.centeredView}>
                <View style={styles.modalViewDelete}>
                  <View>
                    <Text style={{ color: "white" }}>
                      Are You Sure You Want To Delete This Contact?
                    </Text>
                  </View>
                  <View style={{ flexDirection: "row", margin: 40 }}>
                    <TouchableOpacity onPress={() => deleteTodo(todo.id)}>
                      <View style={styles.addModal}>
                        <Text style={{ color: "white" }}>Yes</Text>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={closeModalDelete}>
                      <View style={styles.closeModal}>
                        <Text style={{ color: "white" }}>No</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>
          </View>
          <Text
            style={{
              fontWeight: "bold",
              fontSize: 15,
              margin: 5,
              color: COLORS.primary,
            }}
          >
            {todo?.task}
          </Text>
          <Text
            style={{
              fontWeight: "bold",
              fontSize: 12,
              margin: 5,
              color: "gray",
            }}
          >
            {todo?.task1}
          </Text>
        </View>
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity>
            <View style={[styles.actionIcon, { backgroundColor: "white" }]}>
              <Icon name="edit" size={25} color="green" />
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setModalDelete(true)}>
            <View style={[styles.actionIcon, { backgroundColor: "white" }]}>
              <Icon name="delete" size={25} color="red" />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "white",
      }}
    >
      <View style={styles.header}></View>
      <FlatList
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
        data={todos}
        renderItem={({ item }) => <ListItem todo={item} />}
      />
      <View style={styles.centeredView}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <View>
                <TextInput
                  style={styles.inputName}
                  value={textInput}
                  placeholder="Name"
                  onChangeText={(text) => setTextInput(text)}
                />
                <TextInput
                  style={styles.inputNumber}
                  value={textInput1}
                  placeholder="Number"
                  onChangeText={(text1) => setTextInput1(text1)}
                />
              </View>
              <View style={{ flexDirection: "row", margin: 40 }}>
                <TouchableOpacity onPress={addContact}>
                  <View style={styles.addModal}>
                    <Text style={{ color: "white" }}>Add</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={closeModal}>
                  <View style={styles.closeModal}>
                    <Text style={{ color: "white" }}>close</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
      <View style={styles.footer}>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <View style={styles.iconAdd}>
            <Icon name="add" color="white" size={30} />
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  footer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: COLORS.white,
  },
  inputName: {
    padding: 10,
    margin: 10,
    height: 50,
    width: 200,
    backgroundColor: "white",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  inputNumber: {
    padding: 10,
    margin: 10,
    height: 50,
    width: 200,
    backgroundColor: "white",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  addModal: {
    margin: 10,
    height: 50,
    width: 100,
    backgroundColor: COLORS.primary,
    elevation: 40,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  closeModal: {
    margin: 10,
    height: 50,
    width: 100,
    backgroundColor: "#b80000",
    elevation: 40,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  iconAdd: {
    height: 50,
    width: 50,
    backgroundColor: COLORS.primary,
    elevation: 40,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  listItem: {
    padding: 20,
    backgroundColor: COLORS.white,
    flexDirection: "row",
    elevation: 12,
    borderRadius: 7,
    marginVertical: 10,
    boxShadow: "1px 1px 5px 1px lightgray",
  },
  actionIcon: {
    height: 25,
    width: 25,
    backgroundColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "red",
    marginLeft: 5,
    marginTop: 15,
    borderRadius: 3,
  },
  header: {
    padding: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    height: 300,
    width: 300,
    margin: 20,
    backgroundColor: "#7591c7e0",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalViewDelete: {
    height: 200,
    width: 300,
    margin: 20,
    backgroundColor: "#7591c7e0",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default App;

{
  /* {!todo?.completed && (
          <TouchableOpacity onPress={() => markTodoComplete(todo.id)}>
            <View style={[styles.actionIcon, { backgroundColor: "white" }]}>
              <Icon name="done" size={25} color="green" />
            </View>
          </TouchableOpacity>
        )} */
}

// const markTodoComplete = (todoId) => {
//   const newTodosItem = todos.map((item) => {
//     if (item.id == todoId) {
//       return { ...item, completed: true };
//     }
//     return item;
//   });

//   setTodos(newTodosItem);
// };
