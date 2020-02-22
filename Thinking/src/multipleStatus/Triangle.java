package multipleStatus;

public class Triangle extends Shape {
    @Override
    void erase() {
        System.err.println("this is triangle erase");
    }

    @Override
    void draw() {
        System.err.println("this is triangle draw");
    }
}
