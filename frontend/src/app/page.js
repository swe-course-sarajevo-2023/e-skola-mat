'use client';
import styles from './page.module.css';

const Home = () => {
	return (
		<main className={styles.main}>
			<div className={styles.description}>
				<div>
					<a
						href="https://pmf.unsa.ba"
						target="_blank"
						rel="noopener noreferrer"
					>
						By{' PMF 2023/2024'}
					</a>
				</div>
			</div>

			<div className={styles.center}>
				<h1
					sx={{
						fontSize: '5em',
						color: 'white',
						textShadow: '0 0 10px blue',
					}}
				>
					eŠKOLA MATEMATIKE
				</h1>
			</div>

			<div className={styles.grid}>
				<a
					href="team"
					className={styles.card}
					target="_blank"
					rel="noopener noreferrer"
				>
					<h2>
						Team <span>-&gt;</span>
					</h2>
					<p>
						Discover more about our talented team members and their
						contributions to our project.
					</p>
				</a>

				<a
					href="https://github.com/olden-labs/web-app"
					className={styles.card}
					target="_blank"
					rel="noopener noreferrer"
				>
					<h2>
						Git Hub <span>-&gt;</span>
					</h2>
					<p>
						Explore our project on GitHub to learn more about the codebase and
						contribute to development!
					</p>
				</a>

				<a href="login" className={styles.card} rel="noopener noreferrer">
					<h2>
						Log In <span>-&gt;</span>
					</h2>
					<p>Log in to access and explore the features of our app.</p>
				</a>

				<a
					href="register"
					className={styles.card}
					target="_blank"
					rel="noopener noreferrer"
				>
					<h2>
						Register <span>-&gt;</span>
					</h2>
					<p>Join us! Register now to access exclusive features of our app.</p>
				</a>
			</div>
		</main>
	);
};

export default Home;
