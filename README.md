# aws-event-sourcing
Event sourcing library built with AWS

## What is Event Sourcing?
Event Sourcing ensures that all changes to application state are stored as a sequence of events. Not just can we query these events, we can also use the event log to reconstruct past states, and as a foundation to automatically adjust the state to cope with retroactive changes.
[Martin Fowler](https://www.martinfowler.com/eaaDev/EventSourcing.html)

## Resources
A resource is uniquely identifiable and would extend the `Resource` class and override the `id` property.
```javascript
class Resource {
  get id() {
    throw new NotImplementedError();
  }
}
```

## Events
An event extends the `Event` class and describes what happened to the `Resource`. The implementor is required to implement `number`, `type`, and `created`.
```javascript
class Event {
  get number() {
    throw new NotImplementedError();
  }
  get type() {
    throw new NotImplementedError();
  }
  get created() {
    throw new NotImplementedError();
  }
}
```

## Aggregates
Aggregates group together a `Resource` and its `Event`s. It exposes the following functionality:
- `events` | retrieve up-to-date event history
- `hydrate` | retrieve up-to-date event history and apply the events to the resource
- `apply` | call the appropriate handler to handle the event type and apply state changes to the resource
- `commit` | retrieve up-to-date event history, attempt to apply an event, then publish the new event

## How can I use it?
Consider a loan. This will normally go through a predefined workflow: CREATED -> (APPROVED | REJECTED) -> DISBURSED -> (PAID | ARREARS) -> (SETTLED | COLLECTIONS)

In a typical system, we would represent the loan as a row in a table and possibly update the status as the workflow proceeds. With event sourcing, a loan is persisted as a series of events, each event containing sufficient information to reconstruct the loan state.

## Implementation
Let's use the loan example described above.

The loan aggregate
```javascript
class Loan extends Aggregate {
    constructor(id){
        super({
            table: 'Loans',
            id: 
        })
    }

    onLoanCreated(event){
        if(this.version !== 0) throw new IllegalEventError();
        this.requestedAmount = event.requestedAmount;
        this.interest = event.interest;
        this.lastUpdated = event.created;
        this.status = 'CREATED';
        //perform whatever functionality is required
    }

    onLoanApproved(event){
        //we can only approve a loan that is in the CREATED state
        if(this.status !== 'CREATED') throw new IllegalEventError();
        this.lastUpdated = event.created;
        this.status = 'APPROVED';
        //etc
    }

    onLoanRejected(event){
        //...
    }

    onLoanDisbursed(event){
        //...
    }

    onLoanPaid(event){
        //...
    }

    onLoanArrears(event){
        //...
    }

    onLoanSettled(event){
        //...
    }

    onLoanCollections(event){
        //...
    }
}
```

Using it. 
```javascript
const Loan = require('./models/Loan');
module.exports.createLoan = async (event, context)=>{
    const loan = new Loan();
    await loan.hydrate();
    await loan.commit({
        type: 'LoanCrated',
        number: loan.version + 1,
        requestedAmount: event.amount,
        interest: event.interest,
        created: new Date().toISOString()
    });
    return loan.id;
}

module.exports.approveLoan = async (event, context)=>{
    const loan = new Loan(event.loanId);
    await loan.hydrate();
    await loan.commit({
        type: 'LoanApproved',
        created: new Date().toISOString()
    });
    return loan.id;
}
```