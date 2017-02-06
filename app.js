let sampleRecipes = [
{title: "Red Lentil Curry", ingredients: "Red lentils, garlic, carrots, white onion, salt, curry paste, coconut milk", instructions: "Bring the rice to a boil. Drain the rice and make the curry in a pot with the garlic, carrots, white onion, salt, and curry paste. Add coconut milk to thicken and bring the mixture to a simmer. Enjoy with a hearty salad."},
{title: "Amazing Vegan Cookies", ingredients: "Flour, coconut oil, brown sugar, vanilla extract, baking sugar, baking powder, salt, semi-sweet chocolate chips", instructions: "1) Heat oven to 350F. In large bowl, mix coconut oil, granulated sugar and brown sugar until well mixed. Stir in almond milk and vanilla. 2) Stir in flour, baking soda, baking powder and salt. Stir in chocolate chips. 3) Bake 11 to 14 minutes until edges are light brown and tops look set. Courtesy of Betty Crocker"},
{title: "Ramen", ingredients: "Ramen Noodles, Tears", instructions: "Boil the tears in a pot. If you desire more salt, add the optional Ramen flavoring packet. Put the ramen in the pot. Stir until slightly charred, remove from water, and consume, hopefully without further tears."}
];

const localStorageKey = "_thmsdnnr_recipes";
var Modal = ReactBootstrap.Modal;
var Button = ReactBootstrap.Button;
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state={recipes:[]};
  };
  updateAndSave = (uRecipes) => {
    this.setState({recipes:uRecipes});
    localStorage.setItem(localStorageKey,JSON.stringify(uRecipes));
  };
  //we make copies here to preserve immutability of state
  addRecipe = (e) => { //add takes a title and ingredients
    let uRecipes=this.state.recipes;
    uRecipes.push({title:e.title,ingredients:e.ingredients,instructions:e.instructions});
    this.updateAndSave(uRecipes);
  };
   modifyRecipe = (e) => { //modify takes an index and an array of new key/value params
     //called like this: this.props.modify({index:this.props.id,title:title,ingredients:ingredients,instructions:instructions});
    let uRecipes=this.state.recipes;
    uRecipes[e.index].title=e.title;
    uRecipes[e.index].ingredients=e.ingredients;
    uRecipes[e.index].instructions=e.instructions;
    this.updateAndSave(uRecipes);
  };
  deleteRecipe = (e) => {
    let uRecipes=this.state.recipes;
    uRecipes.splice(e.target.id, 1);
    this.updateAndSave(uRecipes);
  };
  componentWillMount() {
    //grab recipe data from localstorage and pass it to RecipeBox
   localStorage.setItem(localStorageKey,'');
   let recipes=localStorage.getItem(localStorageKey);
   (recipes.length) ? recipes=JSON.parse(recipes) : recipes=sampleRecipes; //if nothing in localstorage, default to SAMPLES
   this.setState({'recipes':recipes});
  }
  render () {
    return (
      <div>
       <AddRecipe add={this.addRecipe}/>
        <RecipeBox recipes={this.state.recipes} add={this.addRecipe} modify={this.modifyRecipe} delete={this.deleteRecipe}/>
      </div>);
  }
}

class RecipeBox extends React.Component {
  constructor(props) { super(props); }
  render() {
    let rows = [];
    this.props.recipes.map((r,i)=>{rows.push(<Recipe recipe={r} key={i} id={i} add={this.props.add} modify={this.props.modify} delete={this.props.delete}/>)});
    return (<div id="accordion" role="tablist" aria-multiselectable="false">{rows.reverse()}</div>);
    }
  }

class Recipe extends React.Component {
  constructor(props) {
    super(props);
  this.state = { showModal: false };
  }

  toggleModal = () => this.setState({showModal:true});
  close = () => this.setState({ showModal: false });
  save = () => {
    let title=document.querySelector('input#newTitle').value;
    let ingredients=document.querySelector('textarea#newIngredients').value;
    let instructions=document.querySelector('textarea#newInstructions').value;
    this.props.modify({index:this.props.id,title:title,ingredients:ingredients,instructions:instructions});
    this.setState({ showModal: false });
  };
      render() {
    var kP=String(this.props.id);
    return (<div>
      <Modal show={this.state.showModal} onHide={close}>
      <Modal.Header>
        <Modal.Title><input type="text" id="newTitle" defaultValue={this.props.recipe.title} />
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <label for="ingredients">Ingredients</label>
        <textarea className="form-control" id="newIngredients" defaultValue={this.props.recipe.ingredients} /><br />
         <label for="ingredients">Instructions</label>
        <textarea className="form-control" id="newInstructions" defaultValue={this.props.recipe.instructions} />
      </Modal.Body>
      <Modal.Footer>
        <Button bsStyle="warning" onClick={this.close}>Discard Changes</Button>
        <Button bsStyle="primary" onClick={this.save}>Save Changes</Button>
      </Modal.Footer>
        </Modal>
    <div className="card">
    <div className="card-header" role="tab" id={'heading'+kP}>
      <a data-toggle="collapse" data-parent="#accordion" href={'#collapse'+kP} aria-expanded="false" aria-controls={'collapse'+kP}>
      {this.props.recipe.title}
      </a>
      <h5 className="mb-0"><ul>{this.props.recipe.ingredients.split(",").map((i)=><li>{i}</li>)}</ul></h5>
      </div>
    <div id={'collapse'+kP} className="collapse" role="tabpanel" aria-labelledby={'heading'+kP}>
      <div className="card-block">
<br />{this.props.recipe.instructions}
      <div className="recipe-modify-controls"><button type="button" className="btn btn-info" data-toggle="modal" data-target="#rModal" onClick={this.toggleModal}>Edit</button>
         <button type="button" className="btn btn-danger" id={this.props.id} onClick={this.props.delete}>Delete</button>
        </div>
      </div>
    </div>
   </div>
  </div>
    );
  }
}

class AddRecipe extends React.Component {
  constructor(props) {
  super(props);
    this.state = { showModal: false };
  }

  toggleModal = () => this.setState({showModal:true});
  close = (e) => this.setState({ showModal: false });
  save = (e) => {
    let title=document.querySelector('input#newTitle').value;
    let ingredients=document.querySelector('textarea#newIngredients').value;
    let instructions=document.querySelector('textarea#newInstructions').value;
    this.props.add({title:title,ingredients:ingredients,instructions:instructions});
    this.setState({ showModal: false });
  };
render() {
  const buttonsInstance = (
      <div id="button"><Button bsStyle="primary" bsSize="large" id="addRecipe" onClick={this.toggleModal}>Add New Recipe (+)</Button></div>
  );
    return (!this.state.showModal) ? buttonsInstance :
    (<div>
      <Modal show={this.state.showModal} onHide={close}>
      <Modal.Header>
        <Modal.Title><input type="text" id="newTitle" placeholder="Recipe Title" ref={input => input && input.focus()} />
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <label for="ingredients">Ingredients</label>
        <textarea className="form-control" id="newIngredients" placeholder="Ingredients,separated,by,commas"></textarea><br />
        <label for="instructions">Instructions</label>
        <textarea className="form-control" id="newInstructions" placeholder="Instructions. How to make the noms?" optional></textarea>
      </Modal.Body>
      <Modal.Footer>
        <Button bsStyle="warning" onClick={this.close}>Discard Recipe</Button>
          <Button bsStyle="primary" onClick={this.save}>Save New Recipe</Button>
      </Modal.Footer>
        </Modal>
        </div>
        );
    }
}

ReactDOM.render(<App />, document.getElementById('app'));
